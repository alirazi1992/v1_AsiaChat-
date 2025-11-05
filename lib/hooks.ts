"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { db } from "./db"
import { ws } from "./ws"
import { useAppStore } from "./store"
import type { Message, SearchFilters, SearchResult } from "./types"
import { useEffect, useState } from "react"

export function useMessages(channelId: string) {
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", channelId],
    queryFn: async () => {
      const msgs = await db.messages
        .where("channelId")
        .equals(channelId)
        .and((msg) => !msg.threadRootId)
        .sortBy("ts")
      return msgs
    },
  })

  useEffect(() => {
    const handleNewMessage = (payload: Message) => {
      if (payload.channelId === channelId) {
        queryClient.setQueryData(["messages", channelId], (old: Message[] = []) => {
          const exists = old.find((m) => m.id === payload.id)
          if (exists) return old
          return [...old, payload]
        })
        db.messages.put(payload)
      }
    }

    const handleAck = async (payload: { pendingId: string; id: string }) => {
      queryClient.setQueryData(["messages", channelId], (old: Message[] = []) => {
        return old.map((m) => (m.id === payload.pendingId ? { ...m, id: payload.id, isPending: false } : m))
      })
      await db.outbox.delete(payload.pendingId)
    }

    ws.on("msg.new", handleNewMessage)
    ws.on("msg.ack", handleAck)

    return () => {
      ws.off("msg.new", handleNewMessage)
      ws.off("msg.ack", handleAck)
    }
  }, [channelId, queryClient])

  return { messages, isLoading }
}

export function useSendMessage(channelId: string) {
  const queryClient = useQueryClient()
  const currentUser = useAppStore((s) => s.currentUser)

  return useMutation({
    mutationFn: async ({ body, files = [], threadRootId }: { body: string; files?: any[]; threadRootId?: string }) => {
      const pendingId = `pending-${Date.now()}-${Math.random()}`
      const message: Message = {
        id: pendingId,
        channelId,
        senderId: currentUser?.id || "user-current",
        body,
        files,
        reactions: [],
        threadRootId,
        threadCount: 0,
        ts: Date.now(),
        isPending: true,
      }

      // Add to cache immediately
      queryClient.setQueryData(["messages", channelId], (old: Message[] = []) => [...old, message])

      // Add to outbox
      await db.outbox.add({
        pendingId,
        channelId,
        body,
        files,
        threadRootId,
        ts: Date.now(),
      })

      // Try to send via WebSocket
      ws.send("msg.send", { pendingId, channelId, body, files, threadRootId, senderId: currentUser?.id })

      return message
    },
  })
}

export function useEditMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, body, channelId }: { messageId: string; body: string; channelId: string }) => {
      await db.messages.update(messageId, { body, editedAt: Date.now() })
      queryClient.invalidateQueries({ queryKey: ["messages", channelId] })
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, channelId }: { messageId: string; channelId: string }) => {
      await db.messages.delete(messageId)
      queryClient.invalidateQueries({ queryKey: ["messages", channelId] })
    },
  })
}

export function useToggleReaction() {
  const queryClient = useQueryClient()
  const currentUser = useAppStore((s) => s.currentUser)

  return useMutation({
    mutationFn: async ({ messageId, emoji, channelId }: { messageId: string; emoji: string; channelId: string }) => {
      const message = await db.messages.get(messageId)
      if (!message) return

      const reactions = [...message.reactions]
      const reactionIndex = reactions.findIndex((r) => r.emoji === emoji)

      if (reactionIndex >= 0) {
        const userIds = reactions[reactionIndex].userIds
        const userId = currentUser?.id || "user-current"
        if (userIds.includes(userId)) {
          reactions[reactionIndex].userIds = userIds.filter((id) => id !== userId)
          if (reactions[reactionIndex].userIds.length === 0) {
            reactions.splice(reactionIndex, 1)
          }
        } else {
          reactions[reactionIndex].userIds.push(userId)
        }
      } else {
        reactions.push({ emoji, userIds: [currentUser?.id || "user-current"] })
      }

      await db.messages.update(messageId, { reactions })
      queryClient.invalidateQueries({ queryKey: ["messages", channelId] })
    },
  })
}

export function useThreadMessages(threadRootId: string) {
  return useQuery({
    queryKey: ["thread", threadRootId],
    queryFn: async () => {
      const msgs = await db.messages.where("threadRootId").equals(threadRootId).sortBy("ts")
      return msgs
    },
    enabled: !!threadRootId,
  })
}

export function useChannels() {
  return useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const channels = await db.channels.toArray()
      return channels
    },
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await db.users.toArray()
      return users
    },
  })
}

export function usePresence() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    const handlePresence = (payload: { userId: string; status: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev)
        if (payload.status === "online") {
          next.add(payload.userId)
        } else {
          next.delete(payload.userId)
        }
        return next
      })
    }

    ws.on("presence.update", handlePresence)
    return () => ws.off("presence.update", handlePresence)
  }, [])

  return { onlineUsers }
}

export function useTyping(channelId: string) {
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const handleTyping = (payload: { channelId: string; userId: string; displayName: string; isTyping: boolean }) => {
      if (payload.channelId !== channelId) return

      setTypingUsers((prev) => {
        const next = new Map(prev)
        if (payload.isTyping) {
          next.set(payload.userId, payload.displayName)
        } else {
          next.delete(payload.userId)
        }
        return next
      })
    }

    ws.on("typing", handleTyping)
    return () => ws.off("typing", handleTyping)
  }, [channelId])

  const setTyping = (isTyping: boolean) => {
    ws.sendTyping(channelId, isTyping)
  }

  return { typingUsers: Array.from(typingUsers.values()), setTyping }
}

export function useSearch() {
  return useMutation({
    mutationFn: async (filters: SearchFilters): Promise<SearchResult[]> => {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      })
      return response.json()
    },
  })
}

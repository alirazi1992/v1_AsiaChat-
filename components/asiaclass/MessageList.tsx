"use client"

import { Virtuoso } from "react-virtuoso"
import { useMessages, useEditMessage, useDeleteMessage, useUsers } from "@/lib/hooks"
import { useAppStore } from "@/lib/store"
import { MessageItem } from "./MessageItem"
import { groupMessagesByDate } from "@/lib/utils"

interface MessageListProps {
  channelId: string
  onReply?: (messageId: string) => void
}

export function MessageList({ channelId, onReply }: MessageListProps) {
  const { messages, isLoading } = useMessages(channelId)
  const { data: users = [] } = useUsers()
  const editMessage = useEditMessage()
  const deleteMessage = useDeleteMessage()
  const locale = useAppStore((s) => s.locale)
  const currentUserId = useAppStore((s) => s.currentUser?.id) || "user-current"

  const groupedMessages = groupMessagesByDate(messages, locale)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Loading messages...</div>
      </div>
    )
  }

  const flatItems: any[] = []
  groupedMessages.forEach((group) => {
    flatItems.push({ type: "date", date: group.date })
    group.messages.forEach((msg) => {
      flatItems.push({ type: "message", message: msg })
    })
  })

  return (
    <div className="flex-1 overflow-hidden">
      <Virtuoso
        data={flatItems}
        itemContent={(index, item) => {
          if (item.type === "date") {
            return (
              <div className="flex items-center justify-center py-4">
                <div className="px-4 py-1 bg-secondary rounded-full text-xs font-medium text-muted-foreground">
                  {item.date}
                </div>
              </div>
            )
          }

          const message = item.message
          const sender = users.find((u) => u.id === message.senderId)
          if (!sender) return null

          return (
            <MessageItem
              key={message.id}
              message={message}
              sender={sender}
              isOwn={message.senderId === currentUserId}
              onReply={onReply ? () => onReply(message.id) : undefined}
              onEdit={(body) => editMessage.mutate({ messageId: message.id, body, channelId })}
              onDelete={() => deleteMessage.mutate({ messageId: message.id, channelId })}
            />
          )
        }}
        followOutput="smooth"
      />
    </div>
  )
}

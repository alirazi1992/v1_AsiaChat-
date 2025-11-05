"use client"

import { X } from "lucide-react"
import { useThreadMessages, useUsers, useSendMessage } from "@/lib/hooks"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { MessageItem } from "./MessageItem"
import { Composer } from "./Composer"

interface ThreadPaneProps {
  threadRootId: string
  channelId: string
  onClose: () => void
}

export function ThreadPane({ threadRootId, channelId, onClose }: ThreadPaneProps) {
  const { data: threadMessages = [] } = useThreadMessages(threadRootId)
  const { data: users = [] } = useUsers()
  const sendMessage = useSendMessage(channelId)
  const locale = useAppStore((s) => s.locale)
  const currentUserId = useAppStore((s) => s.currentUser?.id) || "user-current"
  const t = useTranslation(locale)

  const handleSend = (body: string, files?: any[]) => {
    sendMessage.mutate({ body, files, threadRootId })
  }

  return (
    <aside className="w-96 border-l border-border bg-card flex flex-col" role="complementary" aria-label="Thread">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h2 className="font-semibold">{t("thread")}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close thread">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threadMessages.map((msg) => {
          const sender = users.find((u) => u.id === msg.senderId)
          if (!sender) return null
          return <MessageItem key={msg.id} message={msg} sender={sender} isOwn={msg.senderId === currentUserId} />
        })}
      </div>

      <Composer onSend={handleSend} placeholder={t("thread_reply_placeholder")} />
    </aside>
  )
}

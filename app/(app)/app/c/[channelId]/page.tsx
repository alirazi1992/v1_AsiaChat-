"use client"

import { use, useState } from "react"
import { useChannels, useSendMessage, useTyping } from "@/lib/hooks"
import { MessageList } from "@/components/asiaclass/MessageList"
import { Composer } from "@/components/asiaclass/Composer"
import { ChannelHeader } from "@/components/asiaclass/ChannelHeader"
import { ThreadPane } from "@/components/asiaclass/ThreadPane"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export default function ChannelPage({ params }: { params: Promise<{ channelId: string }> }) {
  const { channelId } = use(params)
  const { data: channels = [] } = useChannels()
  const channel = channels.find((c) => c.id === channelId)
  const sendMessage = useSendMessage(channelId)
  const { typingUsers, setTyping } = useTyping(channelId)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const locale = useAppStore((s) => s.locale)
  const t = useTranslation(locale)

  const handleSend = (body: string, files?: any[]) => {
    sendMessage.mutate({ body, files })
    setTyping(false)
  }

  if (!channel) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">Channel not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex">
      <div className="flex-1 flex flex-col">
        <ChannelHeader channel={channel} />
        <MessageList channelId={channelId} onReply={setActiveThreadId} />
        {typingUsers.length > 0 && (
          <div className="px-4 py-2 text-sm text-muted-foreground">
            {typingUsers.join(", ")} {t("typing")}
          </div>
        )}
        <Composer onSend={handleSend} />
      </div>
      {activeThreadId && (
        <ThreadPane threadRootId={activeThreadId} channelId={channelId} onClose={() => setActiveThreadId(null)} />
      )}
    </div>
  )
}

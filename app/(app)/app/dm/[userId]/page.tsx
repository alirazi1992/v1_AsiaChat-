"use client"

import { use } from "react"
import { useUsers, useSendMessage } from "@/lib/hooks"
import { MessageList } from "@/components/asiaclass/MessageList"
import { Composer } from "@/components/asiaclass/Composer"
import { MessageSquare } from "lucide-react"

export default function DMPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const { data: users = [] } = useUsers()
  const user = users.find((u) => u.id === userId)
  const dmChannelId = `dm-${userId}`
  const sendMessage = useSendMessage(dmChannelId)

  const handleSend = (body: string, files?: any[]) => {
    sendMessage.mutate({ body, files })
  }

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-muted-foreground">User not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-14 border-b border-border flex items-center px-4 bg-card/50 glass">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h2 className="font-semibold text-lg">{user.displayName}</h2>
        </div>
      </div>
      <MessageList channelId={dmChannelId} />
      <Composer onSend={handleSend} />
    </div>
  )
}

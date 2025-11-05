"use client"

import { Hash, Lock } from "lucide-react"
import type { Channel } from "@/lib/types"

interface ChannelHeaderProps {
  channel: Channel
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  return (
    <div className="h-14 border-b border-border flex items-center px-4 bg-card/50 glass">
      <div className="flex items-center gap-2">
        {channel.isPrivate ? <Lock className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
        <h2 className="font-semibold text-lg">{channel.name}</h2>
      </div>
      {channel.description && <span className="ml-4 text-sm text-muted-foreground">{channel.description}</span>}
    </div>
  )
}

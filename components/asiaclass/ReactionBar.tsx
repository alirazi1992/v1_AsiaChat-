"use client"

import { Smile } from "lucide-react"
import type { Reaction } from "@/lib/types"
import { useToggleReaction } from "@/lib/hooks"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface ReactionBarProps {
  messageId: string
  reactions: Reaction[]
  channelId: string
}

const EMOJI_OPTIONS = ["👍", "❤️", "😂", "🎉", "👀", "🚀"]

export function ReactionBar({ messageId, reactions, channelId }: ReactionBarProps) {
  const toggleReaction = useToggleReaction()
  const currentUserId = useAppStore((s) => s.currentUser?.id) || "user-current"

  const handleToggle = (emoji: string) => {
    toggleReaction.mutate({ messageId, emoji, channelId })
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {reactions.map((reaction) => {
        const isActive = reaction.userIds.includes(currentUserId)
        return (
          <button
            key={reaction.emoji}
            onClick={() => handleToggle(reaction.emoji)}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors",
              isActive
                ? "bg-brand-azure/20 border-brand-azure text-brand-azure"
                : "bg-secondary border-border hover:bg-accent",
            )}
          >
            <span>{reaction.emoji}</span>
            <span>{reaction.userIds.length}</span>
          </button>
        )
      })}
      <div className="relative group">
        <button className="p-1 hover:bg-accent rounded" aria-label="Add reaction">
          <Smile className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex bg-popover border border-border rounded-md shadow-lg p-2 gap-1 z-10">
          {EMOJI_OPTIONS.map((emoji) => (
            <button key={emoji} onClick={() => handleToggle(emoji)} className="hover:bg-accent p-1 rounded text-lg">
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

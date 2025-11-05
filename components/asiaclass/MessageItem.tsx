"use client"

import { useState } from "react"
import { MoreVertical, Reply, Edit, Trash, Pin } from "lucide-react"
import type { Message, User } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { ReactionBar } from "./ReactionBar"
import { cn } from "@/lib/utils"

interface MessageItemProps {
  message: Message
  sender: User
  onReply?: () => void
  onEdit?: (body: string) => void
  onDelete?: () => void
  isOwn: boolean
}

export function MessageItem({ message, sender, onReply, onEdit, onDelete, isOwn }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody] = useState(message.body)
  const [showMenu, setShowMenu] = useState(false)
  const locale = useAppStore((s) => s.locale)
  const t = useTranslation(locale)

  const handleSaveEdit = () => {
    if (editBody.trim() && onEdit) {
      onEdit(editBody)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-2 hover:bg-accent/50 transition-colors",
        message.isPending && "opacity-60",
      )}
      id={`msg-${message.id}`}
    >
      <img
        src={sender.avatarUrl || "/placeholder.svg?height=40&width=40"}
        alt={sender.displayName}
        className="h-10 w-10 rounded-md flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-sm">{sender.displayName}</span>
          <span className="text-xs text-muted-foreground">{formatTime(message.ts)}</span>
          {message.editedAt && <span className="text-xs text-muted-foreground italic">({t("edited")})</span>}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full px-2 py-1 border rounded"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={handleSaveEdit} className="text-sm text-brand-azure">
                {t("save")}
              </button>
              <button onClick={() => setIsEditing(false)} className="text-sm text-muted-foreground">
                {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-foreground break-words">{message.body}</p>
            {message.files.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.files.map((file) => (
                  <div key={file.id} className="text-sm text-brand-azure hover:underline">
                    📎 {file.name}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        <div className="mt-2 flex items-center gap-2">
          <ReactionBar messageId={message.id} reactions={message.reactions} channelId={message.channelId} />
          {message.threadCount > 0 && (
            <button onClick={onReply} className="text-xs text-brand-azure hover:underline">
              {message.threadCount} {message.threadCount === 1 ? t("reply") : t("threads")}
            </button>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 transition-opacity relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 hover:bg-accent rounded"
          aria-label="Message actions"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {showMenu && (
          <div className="absolute right-0 top-8 bg-popover border border-border rounded-md shadow-lg py-1 z-10 min-w-[150px]">
            {onReply && (
              <button
                onClick={() => {
                  onReply()
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
              >
                <Reply className="h-4 w-4" />
                {t("reply")}
              </button>
            )}
            {isOwn && onEdit && (
              <button
                onClick={() => {
                  setIsEditing(true)
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                {t("edit")}
              </button>
            )}
            {isOwn && onDelete && (
              <button
                onClick={() => {
                  onDelete()
                  setShowMenu(false)
                }}
                className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2 text-destructive"
              >
                <Trash className="h-4 w-4" />
                {t("delete")}
              </button>
            )}
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-accent flex items-center gap-2">
              <Pin className="h-4 w-4" />
              {t("pin")}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

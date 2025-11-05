"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Hash, Lock, MessageSquare } from "lucide-react"
import { useChannels, useUsers } from "@/lib/hooks"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { PresenceDot } from "./PresenceDot"

export function Sidebar() {
  const pathname = usePathname()
  const locale = useAppStore((s) => s.locale)
  const t = useTranslation(locale)
  const { data: channels = [] } = useChannels()
  const { data: users = [] } = useUsers()

  const currentUserId = "user-current"
  const otherUsers = users.filter((u) => u.id !== currentUserId)

  return (
    <aside
      className="w-64 border-r border-border bg-card/50 glass flex flex-col"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="p-4 border-b border-border">
        <h1 className="text-xl font-bold text-brand-navy dark:text-brand-azure">{t("app_name")}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t("channels")}</h2>
          <div className="space-y-1">
            {channels.map((channel) => (
              <Link
                key={channel.id}
                href={`/app/c/${channel.id}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                  pathname === `/app/c/${channel.id}` && "bg-accent text-accent-foreground font-medium",
                )}
              >
                {channel.isPrivate ? <Lock className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                <span className="flex-1">{channel.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase mb-2">{t("direct_messages")}</h2>
          <div className="space-y-1">
            {otherUsers.map((user) => (
              <Link
                key={user.id}
                href={`/app/dm/${user.id}`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent",
                  pathname === `/app/dm/${user.id}` && "bg-accent text-accent-foreground font-medium",
                )}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="flex-1">{user.displayName}</span>
                <PresenceDot status={user.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

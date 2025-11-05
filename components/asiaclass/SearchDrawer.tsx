"use client"

import { useState } from "react"
import { X, SearchIcon } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { useSearch } from "@/lib/hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatTime } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function SearchDrawer() {
  const [query, setQuery] = useState("")
  const searchDrawerOpen = useAppStore((s) => s.searchDrawerOpen)
  const setSearchDrawerOpen = useAppStore((s) => s.setSearchDrawerOpen)
  const locale = useAppStore((s) => s.locale)
  const t = useTranslation(locale)
  const search = useSearch()
  const router = useRouter()

  const handleSearch = () => {
    if (!query.trim()) return
    search.mutate({ query })
  }

  const handleResultClick = (channelId: string, messageId: string) => {
    router.push(`/app/c/${channelId}#msg-${messageId}`)
    setSearchDrawerOpen(false)
  }

  if (!searchDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={() => setSearchDrawerOpen(false)} />
      <aside className="w-96 bg-card border-l border-border flex flex-col shadow-2xl" role="search">
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <h2 className="font-semibold">{t("search")}</h2>
          <Button variant="ghost" size="icon" onClick={() => setSearchDrawerOpen(false)} aria-label="Close search">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_messages")}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} size="icon">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {search.isPending && <div className="text-muted-foreground text-sm">Searching...</div>}
          {search.data && search.data.length === 0 && (
            <div className="text-muted-foreground text-sm">{t("no_results")}</div>
          )}
          {search.data && search.data.length > 0 && (
            <div className="space-y-2">
              {search.data.map((result) => (
                <button
                  key={result.message.id}
                  onClick={() => handleResultClick(result.channel.id, result.message.id)}
                  className="w-full text-left p-3 rounded-md hover:bg-accent border border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">#{result.channel.name}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(result.message.ts)}</span>
                  </div>
                  <div className="font-medium text-sm mb-1">{result.sender.displayName}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{result.message.body}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

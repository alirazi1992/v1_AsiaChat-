"use client"

import { Search, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "./LanguageToggle"
import { ThemeToggle } from "./ThemeToggle"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"

export function Topbar() {
  const router = useRouter()
  const locale = useAppStore((s) => s.locale)
  const setSearchDrawerOpen = useAppStore((s) => s.setSearchDrawerOpen)
  const t = useTranslation(locale)

  return (
    <header
      className="h-14 border-b border-border bg-card/50 glass flex items-center justify-between px-4"
      role="banner"
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setSearchDrawerOpen(true)} aria-label={t("search")}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={() => router.push("/app/settings")} aria-label={t("settings")}>
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label={t("profile")}>
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}

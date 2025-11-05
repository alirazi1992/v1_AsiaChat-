"use client"

import { Languages } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
  const { locale, setLocale } = useAppStore()

  const toggleLocale = () => {
    setLocale(locale === "en" ? "fa" : "en")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleLocale} aria-label="Toggle language">
      <Languages className="h-5 w-5" />
      <span className="sr-only">{locale === "en" ? "Switch to Persian" : "Switch to English"}</span>
    </Button>
  )
}

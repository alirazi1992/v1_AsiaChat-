"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useAppStore((s) => s.locale)

  useEffect(() => {
    document.documentElement.setAttribute("dir", locale === "fa" ? "rtl" : "ltr")
    document.documentElement.setAttribute("lang", locale)
  }, [locale])

  return <>{children}</>
}

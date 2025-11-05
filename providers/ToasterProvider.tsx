"use client"

import { Toaster } from "sonner"
import { useAppStore } from "@/lib/store"

export function ToasterProvider() {
  const theme = useAppStore((s) => s.theme)

  return <Toaster theme={theme} position="top-right" />
}

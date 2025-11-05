import type React from "react"
import { AppShell } from "@/components/asiaclass/AppShell"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}

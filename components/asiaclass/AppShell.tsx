"use client"

import type React from "react"

import { Sidebar } from "./Sidebar"
import { Topbar } from "./Topbar"
import { SearchDrawer } from "./SearchDrawer"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
      <SearchDrawer />
    </div>
  )
}

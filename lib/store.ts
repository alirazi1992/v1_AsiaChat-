import { create } from "zustand"
import type { User } from "./types"

interface AppState {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  activeThreadId: string | null
  setActiveThreadId: (id: string | null) => void

  searchDrawerOpen: boolean
  setSearchDrawerOpen: (open: boolean) => void

  theme: "light" | "dark"
  setTheme: (theme: "light" | "dark") => void

  locale: "en" | "fa"
  setLocale: (locale: "en" | "fa") => void

  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  activeThreadId: null,
  setActiveThreadId: (id) => set({ activeThreadId: id }),

  searchDrawerOpen: false,
  setSearchDrawerOpen: (open) => set({ searchDrawerOpen: open }),

  theme: "dark",
  setTheme: (theme) => {
    set({ theme })
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme)
      document.documentElement.classList.toggle("dark", theme === "dark")
    }
  },

  locale: "en",
  setLocale: (locale) => {
    set({ locale })
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale)
      document.documentElement.setAttribute("dir", locale === "fa" ? "rtl" : "ltr")
      document.documentElement.setAttribute("lang", locale)
    }
  },

  notificationsEnabled: false,
  setNotificationsEnabled: (enabled) => {
    set({ notificationsEnabled: enabled })
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", enabled ? "true" : "false")
    }
  },
}))

// Initialize from localStorage
if (typeof window !== "undefined") {
  const theme = localStorage.getItem("theme") as "light" | "dark" | null
  const locale = localStorage.getItem("locale") as "en" | "fa" | null
  const notifications = localStorage.getItem("notifications")

  if (theme) {
    useAppStore.getState().setTheme(theme)
  }

  if (locale) {
    useAppStore.getState().setLocale(locale)
  } else {
    // Auto-detect browser language
    const browserLang = navigator.language.toLowerCase()
    if (browserLang.startsWith("fa") || browserLang.startsWith("pe")) {
      useAppStore.getState().setLocale("fa")
    }
  }

  if (notifications) {
    useAppStore.getState().setNotificationsEnabled(notifications === "true")
  }
}

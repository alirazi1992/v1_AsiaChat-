import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(ts: number): string {
  const date = new Date(ts)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function formatDate(ts: number, locale: "en" | "fa"): string {
  const date = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return locale === "en" ? "Today" : "امروز"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return locale === "en" ? "Yesterday" : "دیروز"
  } else {
    return date.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
      month: "short",
      day: "numeric",
    })
  }
}

export function groupMessagesByDate(messages: any[], locale: "en" | "fa") {
  const groups: { date: string; messages: any[] }[] = []
  let currentDate = ""

  messages.forEach((msg) => {
    const date = formatDate(msg.ts, locale)
    if (date !== currentDate) {
      currentDate = date
      groups.push({ date, messages: [msg] })
    } else {
      groups[groups.length - 1].messages.push(msg)
    }
  })

  return groups
}

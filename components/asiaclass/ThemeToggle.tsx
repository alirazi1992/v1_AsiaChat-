"use client"

import { Moon, Sun } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useAppStore()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">{theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}</span>
    </Button>
  )
}

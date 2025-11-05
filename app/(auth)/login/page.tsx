"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { seedDatabase } from "@/lib/db"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const locale = useAppStore((s) => s.locale)
  const setCurrentUser = useAppStore((s) => s.setCurrentUser)
  const t = useTranslation(locale)

  const handleLogin = async () => {
    if (!email) return

    setLoading(true)
    try {
      // Seed database on first login
      await seedDatabase()

      // Mock login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setCurrentUser(data.user)
      toast.success("Logged in successfully")
      router.push("/app")
    } catch (error) {
      toast.error("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy to-brand-azure p-4">
      <div className="w-full max-w-md bg-card rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-navy dark:text-brand-azure mb-2">{t("app_name")}</h1>
          <p className="text-muted-foreground">Sign in to continue</p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              {t("email")}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@asiaclass.com"
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <Button onClick={handleLogin} disabled={!email || loading} className="w-full">
            {loading ? "Loading..." : t("continue")}
          </Button>
        </div>

        <p className="mt-6 text-xs text-center text-muted-foreground">
          This is a mock login. Enter any email to continue.
        </p>
      </div>
    </div>
  )
}

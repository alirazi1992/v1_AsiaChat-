"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function SettingsPage() {
  const locale = useAppStore((s) => s.locale)
  const setLocale = useAppStore((s) => s.setLocale)
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled)
  const setNotificationsEnabled = useAppStore((s) => s.setNotificationsEnabled)
  const currentUser = useAppStore((s) => s.currentUser)
  const t = useTranslation(locale)

  const [displayName, setDisplayName] = useState(currentUser?.displayName || "")

  const handleSave = () => {
    toast.success("Settings saved")
  }

  const handleRequestNotifications = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setNotificationsEnabled(true)
        toast.success("Notifications enabled")
      }
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t("settings")}</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">{t("profile")}</h2>
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-2">
              {t("display_name")}
            </label>
            <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("avatar")}</label>
            <div className="flex items-center gap-4">
              <img
                src={currentUser?.avatarUrl || "/placeholder.svg?height=64&width=64"}
                alt="Avatar"
                className="h-16 w-16 rounded-md"
              />
              <Button variant="secondary">Upload new avatar</Button>
            </div>
          </div>
          <Button onClick={handleSave}>{t("save")}</Button>
        </section>

        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">{t("notifications")}</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{t("desktop_notifications")}</div>
              <div className="text-sm text-muted-foreground">{t("enable_notifications")}</div>
            </div>
            <Button variant={notificationsEnabled ? "default" : "secondary"} onClick={handleRequestNotifications}>
              {notificationsEnabled ? "Enabled" : "Enable"}
            </Button>
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">{t("appearance")}</h2>
          <div>
            <label className="block text-sm font-medium mb-2">{t("language")}</label>
            <div className="flex gap-2">
              <Button variant={locale === "en" ? "default" : "secondary"} onClick={() => setLocale("en")}>
                English
              </Button>
              <Button variant={locale === "fa" ? "default" : "secondary"} onClick={() => setLocale("fa")}>
                فارسی
              </Button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">{t("theme")}</label>
            <div className="flex gap-2">
              <Button variant={theme === "light" ? "default" : "secondary"} onClick={() => setTheme("light")}>
                {t("light")}
              </Button>
              <Button variant={theme === "dark" ? "default" : "secondary"} onClick={() => setTheme("dark")}>
                {t("dark")}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

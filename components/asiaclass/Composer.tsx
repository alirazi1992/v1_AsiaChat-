"use client"

import { useState, useRef, type KeyboardEvent } from "react"
import { Send, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/lib/i18n"
import { useAppStore } from "@/lib/store"
import { toast } from "sonner"

interface ComposerProps {
  onSend: (body: string, files?: any[]) => void
  placeholder?: string
  disabled?: boolean
}

export function Composer({ onSend, placeholder, disabled }: ComposerProps) {
  const [body, setBody] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const locale = useAppStore((s) => s.locale)
  const t = useTranslation(locale)

  const handleSend = () => {
    if (!body.trim() || disabled) return
    onSend(body)
    setBody("")
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        toast.success("File uploaded")
        onSend(`Uploaded: ${file.name}`, [data])
      } catch (error) {
        toast.error("Upload failed")
      }
    }
    input.click()
  }

  return (
    <div className="border-t border-border p-4 bg-card">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || t("message_placeholder")}
            disabled={disabled}
            className="resize-none min-h-[44px] max-h-[200px] pr-20"
            rows={1}
          />
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button type="button" variant="ghost" size="icon" onClick={handleFileUpload} disabled={disabled}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" disabled={disabled}>
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleSend} disabled={!body.trim() || disabled} size="icon">
          <Send className="h-4 w-4" />
          <span className="sr-only">{t("send")}</span>
        </Button>
      </div>
    </div>
  )
}

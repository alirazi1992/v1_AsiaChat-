import { cn } from "@/lib/utils"

interface PresenceDotProps {
  status: "online" | "away" | "offline"
  className?: string
}

export function PresenceDot({ status, className }: PresenceDotProps) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        {
          "bg-green-500": status === "online",
          "bg-yellow-500": status === "away",
          "bg-gray-400": status === "offline",
        },
        className,
      )}
      aria-label={status}
    />
  )
}

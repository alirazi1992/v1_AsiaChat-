import { NextResponse } from "next/server"

export async function GET() {
  // Mock channels - in production, fetch from database
  const channels = [
    {
      id: "general",
      name: "general",
      isPrivate: false,
      description: "General discussion",
      createdAt: Date.now() - 86400000 * 30,
      memberIds: ["user-ali", "user-sina", "user-neda", "user-current"],
    },
    {
      id: "random",
      name: "random",
      isPrivate: false,
      description: "Random chat",
      createdAt: Date.now() - 86400000 * 20,
      memberIds: ["user-ali", "user-sina", "user-neda", "user-current"],
    },
    {
      id: "team-ops",
      name: "team-ops",
      isPrivate: true,
      description: "Operations team",
      createdAt: Date.now() - 86400000 * 10,
      memberIds: ["user-ali", "user-sina", "user-current"],
    },
  ]

  return NextResponse.json(channels)
}

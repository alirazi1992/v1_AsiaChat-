import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { query, channelId, userId } = await request.json()

  // Mock search results
  const results = [
    {
      message: {
        id: "msg-search-1",
        channelId: "general",
        senderId: "user-ali",
        body: `This message contains: ${query}`,
        files: [],
        reactions: [],
        ts: Date.now() - 86400000,
        threadCount: 0,
      },
      channel: {
        id: "general",
        name: "general",
        isPrivate: false,
        description: "General discussion",
        createdAt: Date.now() - 86400000 * 30,
        memberIds: [],
      },
      sender: {
        id: "user-ali",
        displayName: "Ali Rezaei",
        avatarUrl: "/ali-portrait.png",
        locale: "fa" as const,
        status: "online" as const,
      },
    },
  ]

  // Filter by channelId or userId if provided
  const filtered = results.filter((r) => {
    if (channelId && r.channel.id !== channelId) return false
    if (userId && r.sender.id !== userId) return false
    return true
  })

  return NextResponse.json(filtered)
}

import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params

  // Mock DM messages
  const messages = [
    {
      id: "dm-1",
      channelId: `dm-${userId}`,
      senderId: userId,
      body: "Hey there!",
      files: [],
      reactions: [],
      ts: Date.now() - 3600000,
      threadCount: 0,
    },
  ]

  return NextResponse.json(messages)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const { body, files = [] } = await request.json()

  const message = {
    id: `dm-${Date.now()}`,
    channelId: `dm-${userId}`,
    senderId: "user-current",
    body,
    files,
    reactions: [],
    ts: Date.now(),
    threadCount: 0,
  }

  return NextResponse.json(message)
}

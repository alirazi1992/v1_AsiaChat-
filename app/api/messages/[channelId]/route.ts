import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ channelId: string }> }) {
  const { channelId } = await params

  // Mock messages - in production, fetch from database
  const messages = [
    {
      id: "msg-1",
      channelId,
      senderId: "user-ali",
      body: "Welcome to the channel!",
      files: [],
      reactions: [],
      ts: Date.now() - 3600000,
      threadCount: 0,
    },
  ]

  return NextResponse.json(messages)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ channelId: string }> }) {
  const { channelId } = await params
  const { body, files = [], threadRootId } = await request.json()

  const message = {
    id: `msg-${Date.now()}`,
    channelId,
    senderId: "user-current",
    body,
    files,
    reactions: [],
    threadRootId,
    threadCount: 0,
    ts: Date.now(),
  }

  return NextResponse.json(message)
}

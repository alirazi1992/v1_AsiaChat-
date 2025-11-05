import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  // Mock user creation
  const user = {
    id: "user-current",
    displayName: email.split("@")[0],
    avatarUrl: "/abstract-geometric-shapes.png",
    locale: "en" as const,
    status: "online" as const,
  }

  return NextResponse.json({
    token: "mock-token-" + Date.now(),
    user,
  })
}

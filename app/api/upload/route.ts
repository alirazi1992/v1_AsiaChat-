import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  // Mock upload - return fake URL
  const mockFile = {
    id: `file-${Date.now()}`,
    name: file.name,
    url: `/uploads/mock/${file.name}`,
    type: file.type,
    size: file.size,
  }

  return NextResponse.json(mockFile)
}

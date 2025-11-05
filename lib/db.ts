import Dexie, { type Table } from "dexie"
import type { Message, OutboxMessage, Channel, User } from "./types"

export class AsiaClassDB extends Dexie {
  messages!: Table<Message, string>
  outbox!: Table<OutboxMessage, string>
  channels!: Table<Channel, string>
  users!: Table<User, string>

  constructor() {
    super("AsiaClassChatDB")
    this.version(1).stores({
      messages: "id, channelId, senderId, ts, threadRootId",
      outbox: "pendingId, channelId, ts",
      channels: "id, name",
      users: "id, displayName",
    })
  }
}

export const db = new AsiaClassDB()

// Seed initial data
export async function seedDatabase() {
  const channelCount = await db.channels.count()
  if (channelCount > 0) return // Already seeded

  const users: User[] = [
    {
      id: "user-ali",
      displayName: "Ali Rezaei",
      avatarUrl: "/ali-portrait.png",
      locale: "fa",
      status: "online",
    },
    {
      id: "user-sina",
      displayName: "Sina Karimi",
      avatarUrl: "/sina.jpg",
      locale: "en",
      status: "online",
    },
    {
      id: "user-neda",
      displayName: "Neda Ahmadi",
      avatarUrl: "/neda.jpg",
      locale: "fa",
      status: "away",
    },
    {
      id: "user-current",
      displayName: "You",
      avatarUrl: "/abstract-geometric-shapes.png",
      locale: "en",
      status: "online",
    },
  ]

  const channels: Channel[] = [
    {
      id: "general",
      name: "general",
      isPrivate: false,
      description: "General discussion",
      createdAt: Date.now() - 86400000 * 30,
      memberIds: users.map((u) => u.id),
    },
    {
      id: "random",
      name: "random",
      isPrivate: false,
      description: "Random chat",
      createdAt: Date.now() - 86400000 * 20,
      memberIds: users.map((u) => u.id),
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

  const messages: Message[] = [
    {
      id: "msg-1",
      channelId: "general",
      senderId: "user-ali",
      body: "Welcome to AsiaClass Chat! 🎉",
      files: [],
      reactions: [{ emoji: "👋", userIds: ["user-sina", "user-neda"] }],
      ts: Date.now() - 86400000,
      threadCount: 0,
    },
    {
      id: "msg-2",
      channelId: "general",
      senderId: "user-sina",
      body: "Thanks! Excited to be here.",
      files: [],
      reactions: [],
      ts: Date.now() - 86400000 + 60000,
      threadCount: 0,
    },
    {
      id: "msg-3",
      channelId: "general",
      senderId: "user-neda",
      body: "سلام! خوش آمدید",
      files: [],
      reactions: [{ emoji: "❤️", userIds: ["user-ali"] }],
      ts: Date.now() - 3600000,
      threadCount: 0,
    },
  ]

  await db.users.bulkAdd(users)
  await db.channels.bulkAdd(channels)
  await db.messages.bulkAdd(messages)
}

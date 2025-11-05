import { z } from "zod"

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().optional(),
  locale: z.enum(["en", "fa"]).default("en"),
  status: z.enum(["online", "away", "offline"]).default("offline"),
  lastSeen: z.number().optional(),
})

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  isPrivate: z.boolean().default(false),
  description: z.string().optional(),
  createdAt: z.number(),
  memberIds: z.array(z.string()).default([]),
})

export const FileAttachmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string(),
  size: z.number(),
})

export const ReactionSchema = z.object({
  emoji: z.string(),
  userIds: z.array(z.string()),
})

export const MessageSchema = z.object({
  id: z.string(),
  channelId: z.string(),
  senderId: z.string(),
  body: z.string(),
  files: z.array(FileAttachmentSchema).default([]),
  reactions: z.array(ReactionSchema).default([]),
  threadRootId: z.string().optional(),
  threadCount: z.number().default(0),
  ts: z.number(),
  editedAt: z.number().optional(),
  isPending: z.boolean().default(false),
})

export const OutboxMessageSchema = z.object({
  pendingId: z.string(),
  channelId: z.string(),
  body: z.string(),
  files: z.array(FileAttachmentSchema).default([]),
  threadRootId: z.string().optional(),
  ts: z.number(),
})

export type User = z.infer<typeof UserSchema>
export type Channel = z.infer<typeof ChannelSchema>
export type FileAttachment = z.infer<typeof FileAttachmentSchema>
export type Reaction = z.infer<typeof ReactionSchema>
export type Message = z.infer<typeof MessageSchema>
export type OutboxMessage = z.infer<typeof OutboxMessageSchema>

export interface TypingIndicator {
  channelId: string
  userId: string
  displayName: string
}

export interface SearchFilters {
  query: string
  channelId?: string
  userId?: string
  hasFile?: boolean
  before?: Date
  after?: Date
}

export interface SearchResult {
  message: Message
  channel: Channel
  sender: User
}

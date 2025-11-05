/**
 * WebSocket client stub with offline fallback
 * Replace with real WebSocket connection in production
 */

type EventHandler = (payload: any) => void

class WebSocketClient {
  private connected = false
  private handlers: Map<string, Set<EventHandler>> = new Map()
  private reconnectTimer: NodeJS.Timeout | null = null

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => this.handleOnline())
      window.addEventListener("offline", () => this.handleOffline())
    }
  }

  connect() {
    // Simulate connection
    this.connected = navigator.onLine
    if (this.connected) {
      console.log("[v0] WebSocket connected (mock)")
      this.emit("connected", {})
    }
  }

  disconnect() {
    this.connected = false
    console.log("[v0] WebSocket disconnected")
  }

  isConnected(): boolean {
    return this.connected && navigator.onLine
  }

  on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler)
  }

  off(event: string, handler: EventHandler) {
    this.handlers.get(event)?.delete(handler)
  }

  send(type: string, payload: any) {
    if (!this.isConnected()) {
      console.log("[v0] WebSocket offline, queuing message")
      return
    }

    console.log("[v0] WebSocket send:", type, payload)

    // Simulate server echo with delay
    setTimeout(
      () => {
        if (type === "msg.send") {
          this.emit("msg.ack", { pendingId: payload.pendingId, id: `msg-${Date.now()}` })
          this.emit("msg.new", {
            ...payload,
            id: `msg-${Date.now()}`,
            ts: Date.now(),
          })
        }
      },
      100 + Math.random() * 200,
    )
  }

  private emit(event: string, payload: any) {
    const handlers = this.handlers.get(event)
    if (handlers) {
      handlers.forEach((handler) => handler(payload))
    }
  }

  private handleOnline() {
    console.log("[v0] Network online, reconnecting WebSocket")
    this.connected = true
    this.emit("connected", {})
    this.tryFlushOutbox()
  }

  private handleOffline() {
    console.log("[v0] Network offline")
    this.connected = false
    this.emit("disconnected", {})
  }

  async tryFlushOutbox() {
    if (!this.isConnected()) return

    // Import db dynamically to avoid circular dependency
    const { db } = await import("./db")
    const outboxMessages = await db.outbox.toArray()

    for (const msg of outboxMessages) {
      this.send("msg.send", {
        pendingId: msg.pendingId,
        channelId: msg.channelId,
        body: msg.body,
        files: msg.files,
        threadRootId: msg.threadRootId,
      })
      await db.outbox.delete(msg.pendingId)
    }
  }

  // Simulate presence updates
  startPresenceSimulation() {
    setInterval(() => {
      if (this.isConnected()) {
        this.emit("presence.update", {
          userId: `user-${Math.random() > 0.5 ? "ali" : "sina"}`,
          status: Math.random() > 0.7 ? "away" : "online",
        })
      }
    }, 10000)
  }

  // Simulate typing indicators
  sendTyping(channelId: string, isTyping: boolean) {
    if (this.isConnected()) {
      this.send("typing", { channelId, isTyping })
    }
  }
}

export const ws = new WebSocketClient()

// Auto-connect on load
if (typeof window !== "undefined") {
  ws.connect()
  ws.startPresenceSimulation()
}

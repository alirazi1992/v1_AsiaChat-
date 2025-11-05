# AsiaClass Chat

A production-grade, offline-first internal chat application built with Next.js, TypeScript, and modern web technologies.

## Features

- 🚀 **Offline-first**: PWA with service worker and IndexedDB caching
- 🌐 **Bilingual**: Full support for English (LTR) and Persian/Farsi (RTL)
- 💬 **Real-time chat**: WebSocket client with graceful offline fallback
- 🎨 **Modern UI**: Slack-like interface with AsiaClass branding
- ♿ **Accessible**: Full keyboard navigation, ARIA labels, and screen reader support
- 📱 **Responsive**: Works seamlessly on desktop and mobile
- 🎭 **Theming**: Dark and light mode support
- 🔍 **Search**: Global message search with filters
- 🧵 **Threads**: Reply to messages in threaded conversations
- 😊 **Reactions**: Add emoji reactions to messages
- 📎 **File uploads**: Mock file upload functionality
- 👥 **Presence**: See who's online
- ⌨️ **Typing indicators**: See when others are typing

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Database**: IndexedDB (Dexie)
- **Virtualization**: react-virtuoso
- **Validation**: Zod
- **Testing**: Vitest

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login

1. Navigate to the login page
2. Enter any email address (this is a mock login)
3. Click "Continue"
4. You'll be redirected to the app

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
/app
  /(auth)/login          # Login page
  /(app)/app             # Main app with shell
    /c/[channelId]       # Channel pages
    /dm/[userId]         # Direct message pages
    /settings            # Settings page
  /api                   # Mock API routes
/components/asiaclass    # App-specific components
/lib                     # Utilities, hooks, types
/providers               # React context providers
/public                  # Static assets
/test                    # Tests
\`\`\`

## Key Features Explained

### Offline-First Architecture

- **IndexedDB**: Messages, channels, and users are cached locally using Dexie
- **Outbox Pattern**: Messages are queued when offline and sent when connection is restored
- **Service Worker**: Caches app shell for offline access
- **PWA**: Installable as a native app

### WebSocket Client (Mock)

The WebSocket client (`lib/ws.ts`) is a stub that simulates real-time behavior:

- Detects online/offline state
- Queues messages when offline
- Simulates server echo with delays
- Emits presence and typing events

**To replace with real WebSocket:**
1. Update `lib/ws.ts` to connect to your WebSocket server
2. Implement proper authentication
3. Handle reconnection logic
4. Update event handlers for your protocol

### Mock API Routes

All API routes in `/app/api/*` are mocks that return static data. To connect to a real backend:

1. Replace mock responses with actual API calls
2. Add authentication headers
3. Update error handling
4. Configure CORS if needed

### Internationalization (i18n)

- Translations stored in `lib/i18n/en.json` and `lib/i18n/fa.json`
- Auto-detects browser language on first load
- Persists language preference to localStorage
- Automatically switches text direction (LTR/RTL)

### Theming

- Dark mode by default
- Theme persisted to localStorage
- CSS variables for easy customization
- Glassmorphism effects on sidebar/topbar

## Accessibility

- Semantic HTML with proper landmarks
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- Respects `prefers-reduced-motion`

## Performance

- Virtualized message lists for large datasets
- Code splitting with Next.js App Router
- Optimized images with Next.js Image
- React Query caching
- IndexedDB for local data

## Testing

\`\`\`bash
npm test
\`\`\`

Basic tests are included for the WebSocket client. Expand test coverage as needed.

## Customization

### Branding

Update colors in `tailwind.config.ts`:

\`\`\`ts
colors: {
  brand: {
    navy: '#0C2C52',
    teal: '#20B2AA',
    azure: '#4F8EF7',
  },
}
\`\`\`

### Fonts

Fonts are configured in `app/layout.tsx` and `app/globals.css`. Current fonts:
- **English**: Inter
- **Persian**: Vazirmatn

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with PWA support

## License

Internal use only - AsiaClass

## Support

For issues or questions, contact the development team.

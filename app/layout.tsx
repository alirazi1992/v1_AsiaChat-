import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/providers/QueryProvider"
import { ThemeProvider } from "@/providers/ThemeProvider"
import { I18nProvider } from "@/providers/I18nProvider"
import { ToasterProvider } from "@/providers/ToasterProvider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "AsiaClass Chat",
  description: "Internal chat application for AsiaClass",
  manifest: "/manifest.webmanifest",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <QueryProvider>
          <ThemeProvider>
            <I18nProvider>
              {children}
              <ToasterProvider />
            </I18nProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

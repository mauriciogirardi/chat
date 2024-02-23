import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

import { Providers } from '@/providers'

const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Chat',
    default: 'Chat',
  },
  description:
    'Build a application in realtime with websocket, realtime chat app.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={montserrat.className}>
          <Providers>
            <main className="min-h-screen antialiased">{children}</main>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

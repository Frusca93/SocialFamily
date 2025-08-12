import '../styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import LanguageProvider from '@/components/LanguageProvider'

export const metadata: Metadata = {
  title: 'SocialFamily',
  description: 'Un social network per la famiglia',
  icons: {
    icon: '/logo2.png',
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
"use client"
import '../styles/globals.css'

import { ReactNode, useState, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { LanguageContext } from './LanguageContext'
import SocketProvider from '@/components/SocketProvider'

function LanguageProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession?.() || {}
  const userLang = (session?.user as any)?.language || 'it'
  const [lang, setLang] = useState(userLang)
  useEffect(() => { setLang(userLang) }, [userLang])
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo2.png" />
        <meta property="og:image" content="/logo2.png" />
  <meta name="theme-color" content="#7c3aed" />
        <title>SocialFamily</title>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>
          <SocketProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

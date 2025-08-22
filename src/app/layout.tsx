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
  <link rel="icon" type="image/png" sizes="32x32" href="/Alora.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <link rel="apple-touch-icon" href="/Alora.png" />
  <meta property="og:image" content="/Alora.png" />
  <meta name="theme-color" content="#ffffff" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Alora</title>
      </head>
  <body className="min-h-screen bg-gray-50 text-gray-900 safe-pt safe-pb">
        <SessionProvider>
          <SocketProvider>
            <LanguageProvider>{children}</LanguageProvider>
          </SocketProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

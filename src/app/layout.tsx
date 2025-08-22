"use client"
import '../styles/globals.css'

import { ReactNode, useState, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { LanguageContext } from './LanguageContext'
import SocketProvider from '@/components/SocketProvider'

function LanguageProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession?.() || {}
  const userLang = (session?.user as any)?.language || ''
  const [lang, setLangState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('lang')
      return stored || 'it'
    }
    return 'it'
  })

  // Apply language to <html> and persist
  const applyLang = (l: string) => {
    try { window.localStorage.setItem('lang', l) } catch {}
    try { document.documentElement.setAttribute('lang', l) } catch {}
  }

  // When session changes, prefer the user language if present; else keep stored
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('lang') : null
    const next = (userLang && userLang.length ? userLang : (stored || 'it'))
    setLangState(prev => prev === next ? prev : next)
    applyLang(next)
  }, [userLang])

  // Ensure initial mount syncs the <html lang>
  useEffect(() => { applyLang(lang) }, [])

  const setLang = (l: string) => { setLangState(l); applyLang(l) }

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

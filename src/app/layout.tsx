import '../styles/globals.css'
import type { Metadata } from 'next'
import { ReactNode, useState, useEffect } from 'react'
import { SessionProvider, useSession } from 'next-auth/react'
import { LanguageContext } from './LanguageContext'

export const metadata: Metadata = {
  title: 'SocialFamily',
  description: 'Un social network per la famiglia',
  icons: {
    icon: '/logo2.png', // Usa il logo esistente come favicon
  }
}

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
        <link rel="icon" href="/logo2.png" type="image/png" />
        <meta property="og:image" content="/logo2.png" />
        <meta name="theme-color" content="#1976d2" />
        <title>SocialFamily</title>
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <SessionProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

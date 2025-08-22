"use client"

import { useContext } from 'react'
import { LanguageContext } from '@/app/LanguageContext'

export default function MessagesTitle() {
  const { lang } = useContext(LanguageContext)
  const text: Record<string, string> = { it: 'Messaggi', en: 'Messages', fr: 'Messages', es: 'Mensajes' }
  return (
    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
      {text[lang] || text.it}
    </h1>
  )
}

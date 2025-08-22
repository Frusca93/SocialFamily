"use client"

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import Link from 'next/link'
import { LanguageContext } from '@/app/LanguageContext'

type ConversationListItem = {
  id: string
  other?: { id: string; name?: string | null; username?: string | null; image?: string | null }
  last?: { content?: string | null }
  unread?: number
}

export default function MessagesClient({ initialItems = [] as ConversationListItem[] }: { initialItems?: ConversationListItem[] }) {
  const { lang } = useContext(LanguageContext)
  const t = {
    it: {
      searchPerson: 'Cerca persona',
      loading: 'Caricamento…',
      empty: 'Nessuna conversazione',
      newChat: 'Nuova chat',
      searchUser: 'Cerca per nome o username',
      noResults: 'Nessun risultato',
      user: 'Utente',
      deleteForMe: 'Elimina per me',
      deleteConfirm: 'Eliminare questa conversazione solo per te?',
      deleteAria: 'Elimina conversazione',
    },
    en: {
      searchPerson: 'Search person',
      loading: 'Loading…',
      empty: 'No conversations',
      newChat: 'New chat',
      searchUser: 'Search by name or username',
      noResults: 'No results',
      user: 'User',
      deleteForMe: 'Delete for me',
      deleteConfirm: 'Delete this conversation only for you?',
      deleteAria: 'Delete conversation',
    },
    es: {
      searchPerson: 'Buscar persona',
      loading: 'Cargando…',
      empty: 'Sin conversaciones',
      newChat: 'Nuevo chat',
      searchUser: 'Buscar por nombre o usuario',
      noResults: 'Sin resultados',
      user: 'Usuario',
      deleteForMe: 'Eliminar para mí',
      deleteConfirm: '¿Eliminar esta conversación solo para ti?',
      deleteAria: 'Eliminar conversación',
    },
    fr: {
      searchPerson: 'Rechercher une personne',
      loading: 'Chargement…',
      empty: 'Aucune conversation',
      newChat: 'Nouvelle discussion',
      searchUser: 'Rechercher par nom ou pseudo',
      noResults: 'Aucun résultat',
      user: 'Utilisateur',
      deleteForMe: 'Supprimer pour moi',
      deleteConfirm: 'Supprimer cette conversation uniquement pour vous ? ',
      deleteAria: 'Supprimer la conversation',
    },
  }[lang as 'it' | 'en' | 'es' | 'fr']
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ConversationListItem[]>(initialItems)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerQ, setPickerQ] = useState('')
  const [pickerUsers, setPickerUsers] = useState<Array<{ id: string; name?: string | null; username?: string | null; image?: string | null }>>([])
  const pickerRef = useRef<HTMLDivElement | null>(null)
  const ctrlRef = useRef<AbortController | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      // Annulla la richiesta precedente per evitare sovrapposizioni
      ctrlRef.current?.abort()
      const ctrl = new AbortController()
      ctrlRef.current = ctrl
      const r = await fetch('/api/messages' + (q ? `?q=${encodeURIComponent(q)}` : ''), { signal: ctrl.signal, cache: 'no-store' })
      if (!r.ok) throw new Error('Failed to load')
      const data = await r.json()
      setItems(data)
    } catch (e) {
      // noop
    } finally {
      setLoading(false)
    }
  }, [q])

  useEffect(() => {
    let id: any
    const tick = () => { if (!document.hidden) load() }
    tick()
    id = setInterval(tick, 5000)
    const onVis = () => { if (!document.hidden) load() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [load])

  const openPicker = useCallback(() => {
    setPickerOpen(true); setPickerQ(''); setPickerUsers([])
  }, [])

  useEffect(() => {
    if (!pickerOpen) return
    const id = setTimeout(async () => {
      const q = pickerQ.trim()
      const url = '/api/search' + (q ? `?q=${encodeURIComponent(q)}&followingOnly=1` : `?followingOnly=1`)
      const r = await fetch(url, { cache: 'no-store' })
      const j = await r.json().catch(() => ({ users: [] }))
      setPickerUsers(j.users || [])
    }, 200)
    return () => clearTimeout(id)
  }, [pickerOpen, pickerQ])

  const startConversation = useCallback(async (username?: string | null) => {
    if (!username) return
    // Optimistic feedback: chiudi picker e mostra subito in cima
    setPickerOpen(false)
    try {
      const r = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) })
      const j = await r.json()
      if (j?.id) {
        window.location.href = `/messages/${j.id}`
      }
    } catch {
      // fallback: ricarica lista
      load()
    }
  }, [load])

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPerson}
          className="flex-1 rounded-xl border px-3 py-2"
        />
        <button onClick={openPicker} className="rounded-full border px-3 py-2 text-purple-600">
          +
        </button>
      </div>
      <div className="mt-3 divide-y">
        {loading && items.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">{t.loading}</div>
        ) : items.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">{t.empty}</div>
        ) : (
          items.map((x) => (
            <ConversationRow
              key={x.id}
              item={x}
              onDeleted={() => setItems(prev => prev.filter(p => p.id !== x.id))}
            />
          ))
        )}
      </div>

      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/30" onClick={() => setPickerOpen(false)}>
          <div ref={pickerRef} className="safe-pb mb-2 w-full max-w-md rounded-2xl border bg-white p-3 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-2 text-center font-semibold">{t.newChat}</div>
            <input
              autoFocus
              value={pickerQ}
              onChange={(e) => setPickerQ(e.target.value)}
              placeholder={t.searchUser}
              className="mb-2 w-full rounded-xl border px-3 py-2"
            />
            <div className="max-h-64 overflow-y-auto divide-y">
              {pickerUsers.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">{t.noResults}</div>
              ) : (
                pickerUsers.map((u) => (
                  <button key={u.id} className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50" onClick={() => startConversation(u.username)}>
                    {u.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img loading="lazy" src={u.image || ''} alt={u.username || ''} className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="h-10 w-10 rounded-full bg-gray-200" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{u.name || t.user}</div>
                      <div className="truncate text-sm text-gray-500">@{u.username}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ConversationRow({ item, onDeleted }: { item: ConversationListItem, onDeleted?: () => void }) {
  const { lang } = useContext(LanguageContext)
  const t = {
    it: { user: 'Utente', deleteForMe: 'Elimina per me', deleteAria: 'Elimina conversazione', deleteConfirm: 'Eliminare questa conversazione solo per te?' },
    en: { user: 'User', deleteForMe: 'Delete for me', deleteAria: 'Delete conversation', deleteConfirm: 'Delete this conversation only for you?' },
    es: { user: 'Usuario', deleteForMe: 'Eliminar para mí', deleteAria: 'Eliminar conversación', deleteConfirm: '¿Eliminar esta conversación solo para ti?' },
    fr: { user: 'Utilisateur', deleteForMe: 'Supprimer pour moi', deleteAria: 'Supprimer la conversation', deleteConfirm: 'Supprimer cette conversation uniquement pour vous ?' },
  }[lang as 'it' | 'en' | 'es' | 'fr']
  const name = item.other?.name || item.other?.username || t.user
  const last = item.last?.content || ''
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50">
      {item.other?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.other.image || ''} alt={name} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="h-10 w-10 rounded-full bg-gray-200" />)
      }
      <Link href={`/messages/${item.id}`} className="min-w-0 flex-1">
        <div className="truncate font-semibold">{name}</div>
        <div className="truncate text-sm text-gray-500">{last}</div>
      </Link>
      {item.unread ? (
        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{item.unread}</span>
      ) : null}
      <button
        className="ml-2 rounded-full p-2 text-gray-500 hover:text-red-600 hover:bg-red-50"
        title={t.deleteForMe}
        aria-label={t.deleteAria}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const ok = confirm(t.deleteConfirm)
          if (!ok) return
          try {
            const r = await fetch(`/api/messages/${item.id}`, { method: 'DELETE' })
            if (r.ok) onDeleted && onDeleted()
          } catch {}
        }}
      >
        <FiTrash2 className="h-5 w-5" />
      </button>
    </div>
  )
}

"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type ConversationListItem = {
  id: string
  other?: { id: string; name?: string | null; username?: string | null; image?: string | null }
  last?: { content?: string | null }
  unread?: number
}

export default function MessagesClient({ initialItems = [] as ConversationListItem[] }: { initialItems?: ConversationListItem[] }) {
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
  const r = await fetch('/api/search' + (q ? `?q=${encodeURIComponent(q)}` : ''), { cache: 'no-store' })
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
          placeholder="Cerca persona"
          className="flex-1 rounded-xl border px-3 py-2"
        />
        <button onClick={openPicker} className="rounded-full border px-3 py-2 text-purple-600">
          +
        </button>
      </div>
      <div className="mt-3 divide-y">
        {loading && items.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">Caricamento…</div>
        ) : items.length === 0 ? (
          <div className="p-3 text-sm text-gray-500">Nessuna conversazione</div>
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
            <div className="mb-2 text-center font-semibold">Nuova chat</div>
            <input
              autoFocus
              value={pickerQ}
              onChange={(e) => setPickerQ(e.target.value)}
              placeholder="Cerca per nome o username"
              className="mb-2 w-full rounded-xl border px-3 py-2"
            />
            <div className="max-h-64 overflow-y-auto divide-y">
              {pickerUsers.length === 0 ? (
                <div className="p-3 text-sm text-gray-500">Nessun risultato</div>
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
                      <div className="truncate font-semibold">{u.name || 'Utente'}</div>
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
  const name = item.other?.name || item.other?.username || 'Utente'
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
        className="ml-2 rounded-full p-2 text-red-600 hover:bg-red-50"
        title="Elimina per me"
        aria-label="Elimina conversazione"
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const ok = confirm('Eliminare questa conversazione solo per te?')
          if (!ok) return
          try {
            const r = await fetch(`/api/messages/${item.id}`, { method: 'DELETE' })
            if (r.ok) onDeleted && onDeleted()
          } catch {}
        }}
      >
        {/* Trash icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9zm2 2h2V4h-2v1zm-2 5a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V10zm6 0a1 1 0 1 1 2 0v8a1 1 0 1 1-2 0V10z" />
        </svg>
      </button>
    </div>
  )
}

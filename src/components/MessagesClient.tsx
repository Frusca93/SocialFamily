"use client"

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

type ConversationListItem = {
  id: string
  other?: { id: string; name?: string | null; username?: string | null; image?: string | null }
  last?: { content?: string | null }
  unread?: number
}

export default function MessagesClient() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState<ConversationListItem[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerQ, setPickerQ] = useState('')
  const [pickerUsers, setPickerUsers] = useState<Array<{ id: string; name?: string | null; username?: string | null; image?: string | null }>>([])
  const pickerRef = useRef<HTMLDivElement | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const r = await fetch('/api/messages' + (q ? `?q=${encodeURIComponent(q)}` : ''))
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
    load()
    const id = setInterval(load, 3000)
    return () => clearInterval(id)
  }, [load])

  const openPicker = useCallback(() => {
    setPickerOpen(true); setPickerQ(''); setPickerUsers([])
  }, [])

  useEffect(() => {
    if (!pickerOpen) return
    const id = setTimeout(async () => {
      const q = pickerQ.trim()
      const r = await fetch('/api/search' + (q ? `?q=${encodeURIComponent(q)}` : ''))
      const j = await r.json().catch(() => ({ users: [] }))
      setPickerUsers(j.users || [])
    }, 200)
    return () => clearTimeout(id)
  }, [pickerOpen, pickerQ])

  const startConversation = useCallback(async (username?: string | null) => {
    if (!username) return
    const r = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) })
    const j = await r.json()
    if (j?.id) window.location.href = `/messages/${j.id}`
  }, [])

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
          items.map((x) => <ConversationRow key={x.id} item={x} />)
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
                      <img src={u.image || ''} alt={u.username || ''} className="h-10 w-10 rounded-full object-cover" />
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

function ConversationRow({ item }: { item: ConversationListItem }) {
  const name = item.other?.name || item.other?.username || 'Utente'
  const last = item.last?.content || ''
  return (
    <Link href={`/messages/${item.id}`} className="flex items-center gap-3 p-3 hover:bg-gray-50">
      {item.other?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.other.image || ''} alt={name} className="h-10 w-10 rounded-full object-cover" />
      ) : (
        <span className="h-10 w-10 rounded-full bg-gray-200" />)
      }
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold">{name}</div>
        <div className="truncate text-sm text-gray-500">{last}</div>
      </div>
      {item.unread ? (
        <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{item.unread}</span>
      ) : null}
    </Link>
  )
}

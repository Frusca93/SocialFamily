"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type Message = {
  id: string
  content: string
  createdAt: string
  senderId: string
}

type HeaderData = {
  other?: { name?: string | null; username?: string | null; image?: string | null }
}

function useAutoScroll(dep: any) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [dep])
  return ref
}

function Header({ conversationId }: { conversationId: string }) {
  const [data, setData] = useState<HeaderData | null>(null)
  const load = useCallback(async () => {
    const r = await fetch(`/api/messages/${conversationId}`)
    if (!r.ok) return
    const j = await r.json()
    setData({ other: j.other })
  }, [conversationId])
  useEffect(() => {
    load()
  }, [load])
  const title = data?.other?.name || data?.other?.username || 'Chat'
  return (
    <div className="flex items-center gap-2">
      {data?.other?.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={data.other.image || ''} alt={title} className="h-8 w-8 rounded-full object-cover" />
      ) : (
        <span className="h-8 w-8 rounded-full bg-gray-200" />
      )}
      <div className="font-semibold">{title}</div>
    </div>
  )
}

export default function ChatClient({ conversationId }: { conversationId: string }) {
  const [me, setMe] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const r = await fetch(`/api/messages/${conversationId}`)
    if (!r.ok) return
    const j = await r.json()
    setMessages(j.messages || [])
    setMe(j.meId)
    setLoading(false)
  }, [conversationId])

  useEffect(() => {
    load()
    const id = setInterval(load, 2500)
    return () => clearInterval(id)
  }, [load])

  const onSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    // optimistic
    const temp: Message = { id: 'temp-' + Date.now(), content: text, createdAt: new Date().toISOString(), senderId: me || 'me' }
    setMessages((prev) => [...prev, temp])
    const r = await fetch(`/api/messages/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    })
    if (!r.ok) {
      // rollback basic
      setMessages((prev) => prev.filter((m) => m.id !== temp.id))
    } else {
      const j = await r.json()
      setMessages((prev) => prev.map((m) => (m.id === temp.id ? j.message : m)))
    }
  }, [conversationId, input, me])

  const listRef = useAutoScroll(messages.length)

  return (
    <>
      <div ref={listRef} className="flex-1 overflow-y-auto p-3">
        {loading && messages.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">Caricamento…</div>
        ) : (
          <div className="space-y-2">
            {messages.map((m) => (
              <MessageBubble key={m.id} meId={me} msg={m} />
            ))}
          </div>
        )}
      </div>
  {/* Offset above bottom navbar on mobile */}
      <div className="safe-pb sticky bottom-[5rem] sm:bottom-0 flex items-end gap-2 border-t bg-white p-2">
        <AutoTextarea
          value={input}
          onChange={setInput}
          placeholder="Scrivi un messaggio"
          onEnter={onSend}
        />
        <button onClick={onSend} className="rounded-xl bg-purple-600 px-4 py-2 text-white">
          Invia
        </button>
      </div>
    </>
  )
}

function MessageBubble({ meId, msg }: { meId: string | null; msg: Message }) {
  const mine = meId && msg.senderId === meId
  const base = 'max-w-[75%] rounded-2xl px-3 py-2 text-sm'
  const cls = mine
    ? 'ml-auto bg-purple-200 text-purple-900'
    : 'mr-auto bg-purple-500/90 text-white'
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`${base} ${cls}`}>{msg.content}</div>
    </div>
  )
}

function AutoTextarea({ value, onChange, placeholder, onEnter }: { value: string; onChange: (v: string) => void; placeholder?: string; onEnter?: () => void }) {
  const ref = useRef<HTMLTextAreaElement | null>(null)
  const resize = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.height = '0px'
    const max = 5 // righe
    const lineHeight = parseInt(getComputedStyle(el).lineHeight || '20', 10)
    const wanted = Math.min(el.scrollHeight, lineHeight * max + 16)
    el.style.height = wanted + 'px'
    el.style.overflowY = el.scrollHeight > wanted ? 'auto' : 'hidden'
  }, [])
  useEffect(() => { resize() }, [value, resize])
  return (
    <textarea
      ref={ref}
      value={value}
      placeholder={placeholder}
      rows={1}
      className="max-h-40 min-h-[2.5rem] flex-1 resize-none rounded-xl border px-3 py-2 leading-6 focus:outline-none"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnter && onEnter() } }}
    />
  )
}

ChatClient.Header = Header as any

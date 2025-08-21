"use client"

import { useCallback, useEffect, useRef, useState } from 'react'

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

export function ChatHeader({ conversationId }: { conversationId: string }) {
  const [data, setData] = useState<HeaderData | null>(null)
  const load = useCallback(async () => {
  const r = await fetch(`/api/messages/${conversationId}`, { cache: 'no-store' })
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
        <img loading="lazy" src={data.other.image || ''} alt={title} className="h-8 w-8 rounded-full object-cover" />
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
  const sendingRef = useRef<Set<string>>(new Set())
  const listRef = useAutoScroll(messages.length)
  const inputWrapRef = useRef<HTMLDivElement | null>(null)
  const [inputH, setInputH] = useState(56)

  useEffect(() => {
    const el = inputWrapRef.current
    if (!el) return
    const set = () => setInputH(el.offsetHeight || 56)
    set()
    let ro: ResizeObserver | null = null
    const RO = (window as any).ResizeObserver
    if (typeof RO === 'function') {
      ro = new RO(() => set())
      ro.observe(el)
    } else {
      // fallback: resize on window resize
      const onResize = () => set()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }
    return () => { if (ro) ro.disconnect() }
  }, [])

  const load = useCallback(async () => {
    const r = await fetch(`/api/messages/${conversationId}`, { cache: 'no-store' })
    if (!r.ok) return
    const j = await r.json()
    setMessages(j.messages || [])
    setMe(j.meId)
    setLoading(false)
  }, [conversationId])

  useEffect(() => {
    let id: any
    const tick = () => { if (!document.hidden) load() }
    tick()
    id = setInterval(tick, 4000)
    const onVis = () => { if (!document.hidden) load() }
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVis) }
  }, [load])

  const onSend = useCallback(async () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    // optimistic
    const tempId = 'temp-' + Date.now()
    const temp: Message = { id: tempId, content: text, createdAt: new Date().toISOString(), senderId: me || 'me' }
    sendingRef.current.add(tempId)
    setMessages((prev) => [...prev, temp])
    const r = await fetch(`/api/messages/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    })
    if (!r.ok) {
      // rollback basic
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
      sendingRef.current.delete(tempId)
    } else {
      const j = await r.json()
      setMessages((prev) => {
        // remove temp and add server message if not already present
        const withoutTemp = prev.filter((m) => m.id !== tempId)
        if (!withoutTemp.some((m) => m.id === j.message.id)) {
          withoutTemp.push(j.message)
        }
        return withoutTemp
      })
      sendingRef.current.delete(tempId)
      // Ensure we reconcile with server state to avoid race with polling
      try { await load() } catch {}
    }
  }, [conversationId, input, me])

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
  <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto p-3" style={{ paddingBottom: inputH }}>
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
  {/* Offset the input above the mobile bottom navbar (h-20 ~= 5rem). On larger screens keep it at bottom: 0. */}
  <div ref={inputWrapRef} className="safe-pb sticky bottom-0 z-10 flex items-end gap-2 border-t bg-white p-2">
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
    </div>
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
    const wanted = Math.min(el.scrollHeight, lineHeight * max + 16) // +padding
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
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onEnter && onEnter() }
      }}
    />
  )
}

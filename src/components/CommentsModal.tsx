

"use client"
import React, { useEffect, useRef, useContext } from "react"
import { LanguageContext } from '@/app/LanguageContext'

const translations = {
  it: {
    title: "Commenti",
    loading: "Caricamento...",
    noComments: "Nessun commento",
  anonymous: "Anonimo",
  reply: "Rispondi",
  writeReply: "Scrivi una risposta",
  send: "Invia"
  },
  en: {
    title: "Comments",
    loading: "Loading...",
    noComments: "No comments",
  anonymous: "Anonymous",
  reply: "Reply",
  writeReply: "Write a reply",
  send: "Send"
  },
  fr: {
    title: "Commentaires",
    loading: "Chargement...",
    noComments: "Aucun commentaire",
  anonymous: "Anonyme",
  reply: "Répondre",
  writeReply: "Écrire une réponse",
  send: "Envoyer"
  },
  es: {
    title: "Comentarios",
    loading: "Cargando...",
    noComments: "Sin comentarios",
  anonymous: "Anónimo",
  reply: "Responder",
  writeReply: "Escribe una respuesta",
  send: "Enviar"
  }
}

export default function CommentsModal({ postId, onClose }: { postId: string, onClose: () => void }) {
  const [comments, setComments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [replyFor, setReplyFor] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;

  useEffect(() => {
    async function fetchComments() {
      setLoading(true)
      const res = await fetch(`/api/comments?postId=${postId}`)
      if (res.ok) {
        setComments(await res.json())
      }
      setLoading(false)
    }
    fetchComments()
  }, [postId])

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div ref={modalRef} className="relative w-full max-w-md max-h-[80vh] bg-white rounded-2xl p-6 shadow-xl flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800">×</button>
        <h2 className="text-lg font-semibold mb-4">{t.title}</h2>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {loading ? (
            <div>{t.loading}</div>
          ) : comments.length === 0 ? (
            <div className="text-gray-500">{t.noComments}</div>
          ) : (
            // Render nested: group by parentId
            (() => {
              const byParent: Record<string, any[]> = {}
              for (const c of comments) {
                const key = c.parentId || 'root'
                if (!byParent[key]) byParent[key] = []
                byParent[key].push(c)
              }
              const roots = byParent['root'] || []
              const renderItem = (c: any) => (
                <div key={c.id} className="border-b pb-2">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="font-semibold">{c.author?.name || t.anonymous} <span className="text-xs text-gray-400">@{c.author?.username}</span></div>
                      <div className="text-sm text-gray-700">{c.content}</div>
                      <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                    </div>
                    <button className="text-xs text-blue-600 hover:underline" onClick={() => { setReplyFor(c.id); setReplyText('') }}>{t.reply}</button>
                  </div>
                  {replyFor === c.id && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault()
                        if (!replyText.trim()) return
                        const res = await fetch('/api/comments', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ postId, content: replyText, parentCommentId: c.id })
                        })
                        if (res.ok) {
                          setReplyFor(null); setReplyText('')
                          // refresh
                          const r = await fetch(`/api/comments?postId=${postId}`)
                          if (r.ok) setComments(await r.json())
                        }
                      }}
                      className="mt-2 flex gap-2"
                    >
                      <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
                      <button className="rounded-xl border px-3 py-1.5 text-sm">{t.send}</button>
                    </form>
                  )}
                  {/* Replies */}
                  {(byParent[c.id] || []).map((rc) => (
                    <div key={rc.id} className="mt-2 ml-4 pl-3 border-l space-y-1">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{rc.author?.name || t.anonymous} <span className="text-[10px] text-gray-400">@{rc.author?.username}</span></div>
                          <div className="text-sm text-gray-700">{rc.content}</div>
                          <div className="text-xs text-gray-400">{rc.createdAt ? new Date(rc.createdAt).toLocaleString() : ''}</div>
                        </div>
                        <button className="text-[11px] text-blue-600 hover:underline" onClick={() => { setReplyFor(rc.id); setReplyText('') }}>{t.reply}</button>
                      </div>
                      {replyFor === rc.id && (
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault()
                            if (!replyText.trim()) return
                            const res = await fetch('/api/comments', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ postId, content: replyText, parentCommentId: rc.id })
                            })
                            if (res.ok) {
                              setReplyFor(null); setReplyText('')
                              const r = await fetch(`/api/comments?postId=${postId}`)
                              if (r.ok) setComments(await r.json())
                            }
                          }}
                          className="mt-2 flex gap-2"
                        >
                          <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
                          <button className="rounded-xl border px-3 py-1.5 text-sm">{t.send}</button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )
              return (
                <div className="space-y-3">
                  {roots.map(renderItem)}
                </div>
              )
            })()
          )}
        </div>
      </div>
    </div>
  )
}

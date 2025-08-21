

"use client"
import React, { useEffect, useRef, useContext } from "react"
import { useSession } from 'next-auth/react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FiTrash2 } from 'react-icons/fi'
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
  const [error, setError] = React.useState<string | null>(null)
  const [replyFor, setReplyFor] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  const { data: session } = useSession()

  const refresh = async () => {
    const r = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}` , { cache: 'no-store' })
    if (r.ok) setComments(await r.json())
  }

  const toggleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' })
      if (!res.ok) {
        if (res.status === 401) alert('Accedi per mettere Mi piace ai commenti.')
        return
      }
      const data = await res.json().catch(() => null)
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, myLiked: data?.liked ?? !c.myLiked, likesCount: data?.likesCount ?? (c.myLiked ? Math.max(0, (c.likesCount||0)-1) : (c.likesCount||0)+1) } : c))
    } catch {}
  }

  const canDelete = (c: any) => (session?.user as any)?.id && c.authorId === (session?.user as any)?.id
  const onDelete = async (commentId: string) => {
    if (!confirm('Eliminare il commento?')) return
    const res = await fetch(`/api/comments?commentId=${encodeURIComponent(commentId)}`, { method: 'DELETE' })
    if (res.ok) await refresh()
  }

  const renderMentions = (text: string) => {
    const parts = (text || '').split(/(@[a-zA-Z0-9_]+)/g)
    return parts.map((p, i) => {
      const m = p.match(/^@([a-zA-Z0-9_]+)$/)
      if (m) {
        const username = m[1]
        return <a key={i} href={`/profile/${username}`} className="text-purple-600 hover:underline">@{username}</a>
      }
      return <span key={i}>{p}</span>
    })
  }

  useEffect(() => {
    async function fetchComments() {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}` , { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json().catch(() => [])
        setComments(Array.isArray(data) ? data : [])
      } else {
        setError(`Errore ${res.status}`)
        setComments([])
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
            <div className="text-gray-500">{error ? error : t.noComments}</div>
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
                      <div className="text-sm text-gray-700">{renderMentions(c.content)}</div>
                      <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleLike(c.id)}
                        className={`px-2 py-0.5 rounded-full border text-xs flex items-center gap-1 justify-center min-w-[46px] cursor-pointer ${c.myLiked ? 'border-purple-500 text-purple-600' : 'border-purple-300 text-purple-500'}`}
                        style={{ borderWidth: 0.5 }}
                        aria-label="Mi piace"
                        title="Mi piace"
                      >
                        {c.myLiked ? <AiFillHeart className="text-purple-600" /> : <AiOutlineHeart className="text-purple-500" />}
                        <span>{c.likesCount || 0}</span>
                      </button>
                      <button type="button" className="text-xs text-blue-600 hover:underline cursor-pointer" onClick={() => { setReplyFor(c.id); setReplyText('') }}>{t.reply}</button>
                      {canDelete(c) && (
                        <button type="button" className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer" onClick={() => onDelete(c.id)} aria-label="Elimina commento" title="Elimina commento">
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
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
                          const r = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}` , { cache: 'no-store' })
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
                          <div className="text-sm text-gray-700">{renderMentions(rc.content)}</div>
                          <div className="text-xs text-gray-400">{rc.createdAt ? new Date(rc.createdAt).toLocaleString() : ''}</div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleLike(rc.id)}
                            className={`px-2 py-0.5 rounded-full border text-[11px] flex items-center gap-1 justify-center min-w-[46px] cursor-pointer ${rc.myLiked ? 'border-purple-500 text-purple-600' : 'border-purple-300 text-purple-500'}`}
                            style={{ borderWidth: 0.5 }}
                            aria-label="Mi piace"
                            title="Mi piace"
                          >
                            {rc.myLiked ? <AiFillHeart className="text-purple-600" /> : <AiOutlineHeart className="text-purple-500" />}
                            <span>{rc.likesCount || 0}</span>
                          </button>
                          <button type="button" className="text-[11px] text-blue-600 hover:underline cursor-pointer" onClick={() => { setReplyFor(rc.id); setReplyText('') }}>{t.reply}</button>
                          {canDelete(rc) && (
                            <button type="button" className="text-[11px] text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer" onClick={() => onDelete(rc.id)} aria-label="Elimina commento" title="Elimina commento">
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
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
                              const r = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}` , { cache: 'no-store' })
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

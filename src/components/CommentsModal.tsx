"use client"
import React, { useEffect, useRef, useContext } from "react"
import { useSession } from 'next-auth/react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FiTrash2 } from 'react-icons/fi'
import { LanguageContext } from '@/app/LanguageContext'

const translations = {
  it: { title: "Commenti", loading: "Caricamento...", noComments: "Nessun commento", anonymous: "Anonimo", reply: "Rispondi", writeReply: "Scrivi una risposta", send: "Invia" },
  en: { title: "Comments", loading: "Loading...", noComments: "No comments", anonymous: "Anonymous", reply: "Reply", writeReply: "Write a reply", send: "Send" },
  fr: { title: "Commentaires", loading: "Chargement...", noComments: "Aucun commentaire", anonymous: "Anonyme", reply: "Répondre", writeReply: "Écrire une réponse", send: "Envoyer" },
  es: { title: "Comentarios", loading: "Cargando...", noComments: "Sin comentarios", anonymous: "Anónimo", reply: "Responder", writeReply: "Escribe una respuesta", send: "Enviar" },
}

type CommentT = {
  id: string
  content: string
  authorId: string
  author?: { name?: string | null; username?: string | null }
  parentId?: string | null
  createdAt?: string | Date
  likesCount?: number
  myLiked?: boolean
}

export default function CommentsModal({ postId, onClose }: { postId: string, onClose: () => void }) {
  const [comments, setComments] = React.useState<CommentT[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [replyFor, setReplyFor] = React.useState<string | null>(null)
  const [replyText, setReplyText] = React.useState('')
  const modalRef = useRef<HTMLDivElement>(null)
  const { lang } = useContext(LanguageContext)
  const t = (translations as any)[lang] || translations.it
  const { data: session } = useSession()

  const renderMentions = (text: string) => {
    const parts = (text || '').split(/(@[a-zA-Z0-9_]+)/g)
    return parts.map((p, i) => {
      const m = p.match(/^@([a-zA-Z0-9_]+)$/)
      if (m) return <a key={i} href={`/profile/${m[1]}`} className="text-purple-600 hover:underline">@{m[1]}</a>
      return <span key={i}>{p}</span>
    })
  }

  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json().catch(() => [])
      setComments(Array.isArray(data) ? data : [])
    } catch (e: any) {
      setError('Errore ' + (e?.message || ''))
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refresh() }, [postId])

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose() }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [onClose])

  const toggleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' })
      if (!res.ok) { if (res.status === 401) alert('Accedi per mettere Mi piace ai commenti.'); return }
      const data = await res.json().catch(() => null)
      setComments(prev => prev.map(c => c.id === commentId ? {
        ...c,
        myLiked: data?.liked ?? !c.myLiked,
        likesCount: data?.likesCount ?? (c.myLiked ? Math.max(0, (c.likesCount || 0) - 1) : (c.likesCount || 0) + 1)
      } : c))
    } catch {}
  }

  const canDelete = (c: CommentT) => (session?.user as any)?.id && c.authorId === (session?.user as any)?.id
  const onDelete = async (commentId: string) => {
    if (!confirm('Eliminare il commento?')) return
    const res = await fetch(`/api/comments?commentId=${encodeURIComponent(commentId)}`, { method: 'DELETE' })
    if (res.ok) refresh()
  }

  // Group by parent for recursive render
  const byParent = React.useMemo(() => {
    const map: Record<string, CommentT[]> = {}
    for (const c of comments) {
      const key = c.parentId || 'root'
      if (!map[key]) map[key] = []
      map[key].push(c)
    }
    return map
  }, [comments])

  const ReplyForm = ({ targetId }: { targetId: string }) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    React.useEffect(() => { inputRef.current?.focus() }, [])
    return replyFor === targetId ? (
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          if (!replyText.trim()) return
          const res = await fetch('/api/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content: replyText, parentCommentId: targetId })
          })
          if (res.ok) { setReplyFor(null); setReplyText(''); await refresh() }
        }}
        className="mt-2 flex gap-2"
      >
        <input ref={inputRef} autoFocus value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
        <button className="rounded-xl border px-3 py-1.5 text-sm">{t.send}</button>
      </form>
    ) : null
  }

  const Thread = ({ c, depth = 0 }: { c: CommentT; depth?: number }) => (
    <div className={depth === 0 ? 'border-b pb-2' : 'mt-2 pl-3 border-l-2 border-violet-400'}>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className={depth === 0 ? 'font-semibold' : 'font-semibold text-sm'}>
            {c.author?.name || t.anonymous} <span className={depth === 0 ? 'text-xs text-gray-400' : 'text-[10px] text-gray-400'}>@{c.author?.username}</span>
          </div>
          <div className="text-sm text-gray-700">{renderMentions(c.content)}</div>
          <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt as any).toLocaleString() : ''}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button type="button" onClick={() => toggleLike(c.id)} className={`px-2 py-0.5 rounded-full border ${depth === 0 ? 'text-xs' : 'text-[11px]'} flex items-center gap-1 justify-center min-w-[46px] cursor-pointer ${c.myLiked ? 'border-purple-500 text-purple-600' : 'border-purple-300 text-purple-500'}`} style={{ borderWidth: 0.5 }} aria-label="Mi piace" title="Mi piace">
            {c.myLiked ? <AiFillHeart className="text-purple-600" /> : <AiOutlineHeart className="text-purple-500" />}
            <span>{c.likesCount || 0}</span>
          </button>
          <button type="button" className={`${depth === 0 ? 'text-xs' : 'text-[11px]'} text-blue-600 hover:underline cursor-pointer`} onClick={() => { setReplyFor(c.id); setReplyText('') }}>{t.reply}</button>
          {canDelete(c) && (
            <button type="button" className={`${depth === 0 ? 'text-xs' : 'text-[11px]'} text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer`} onClick={() => onDelete(c.id)} aria-label="Elimina commento" title="Elimina commento">
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>
      <ReplyForm targetId={c.id} />
      {(byParent[c.id] || []).map(child => (
        <Thread key={child.id} c={child} depth={(depth || 0) + 1} />
      ))}
    </div>
  )

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
            <div className="space-y-3">
              {(byParent['root'] || []).map(c => (
                <Thread key={c.id} c={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

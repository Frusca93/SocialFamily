'use client'
import { useState, useContext, useEffect, useMemo, useRef } from 'react'
import LikesModal from './LikesModal'
import { LanguageContext } from '@/app/LanguageContext'
import { useSession } from 'next-auth/react'
import DeleteConfirmModal from './DeleteConfirmModal'
import { RxCross2 } from 'react-icons/rx'
import { IoSend } from 'react-icons/io5'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { BsChatDots } from 'react-icons/bs'

const translations = {
  it: {
    delete: 'Elimina post',
    like: 'Mi piace',
    comments: 'Commenti',
    writeComment: 'Scrivi un commento',
  send: 'Invia',
  loading: 'Caricamento...',
  noComments: 'Nessun commento',
  anonymous: 'Anonimo',
  reply: 'Rispondi',
  writeReply: 'Scrivi una risposta',
  },
  en: {
    delete: 'Delete post',
    like: 'Like',
    comments: 'Comments',
    writeComment: 'Write a comment',
  send: 'Send',
  loading: 'Loading...',
  noComments: 'No comments',
  anonymous: 'Anonymous',
  reply: 'Reply',
  writeReply: 'Write a reply',
  },
  fr: {
    delete: 'Supprimer le post',
    like: 'J’aime',
    comments: 'Commentaires',
    writeComment: 'Écrire un commentaire',
  send: 'Envoyer',
  loading: 'Chargement...',
  noComments: 'Aucun commentaire',
  anonymous: 'Anonyme',
  reply: 'Répondre',
  writeReply: 'Écrire une réponse',
  },
  es: {
    delete: 'Eliminar publicación',
    like: 'Me gusta',
    comments: 'Comentarios',
    writeComment: 'Escribe un comentario',
  send: 'Enviar',
  loading: 'Cargando...',
  noComments: 'Sin comentarios',
  anonymous: 'Anónimo',
  reply: 'Responder',
  writeReply: 'Escribe una respuesta',
  },
}

export default function PostCard({ post }: { post: any }) {
  const [likes, setLikes] = useState(post._count?.likes ?? 0)
  const [comments, setComments] = useState(post._count?.comments ?? 0)
  const [comment, setComment] = useState('')
  const [commentPosting, setCommentPosting] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [mentionOpen, setMentionOpen] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { data: session } = useSession()
  const isOwner = session?.user && (session.user as any).id === post.authorId

  const { lang } = useContext(LanguageContext)
  const t = translations[lang as keyof typeof translations] || translations.it

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      if (res.ok) {
        // chiudi modal e ricarica
        setShowDelete(false)
        window.location.reload()
      }
    } finally {
      setDeleting(false)
    }
  }

  const [liked, setLiked] = useState(post.liked ?? false);
  const [showLikes, setShowLikes] = useState(false);
  async function toggleLike() {
    const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
    if (!res.ok) return
    const data = await res.json()
    setLikes(v => v + (data.liked ? 1 : -1))
    setLiked(data.liked)
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim() || commentPosting) return
    setCommentPosting(true)
    const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: post.id, content: comment }) })
    if (res.ok) { setComments(c => c + 1); setComment('') }
    setCommentPosting(false)
  }

  return (
    <article id={post.id ? `post-${post.id}` : undefined} className="relative rounded-2xl p-[1px] bg-gradient-to-b from-indigo-400 to-purple-400">
      <div className="rounded-2xl bg-white/90 backdrop-blur p-4">
      <header className="mb-2 flex items-center gap-3">
        {isOwner && (
          <button
            onClick={() => setShowDelete(true)}
            className="absolute top-2 right-2 p-2 text-red-600 hover:bg-red-100 rounded-full"
            title={t.delete}
            aria-label={t.delete}
          >
            <RxCross2 className="w-6 h-6" />
          </button>
        )}
      {showDelete && (
        <DeleteConfirmModal loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
      )}
        <a href={post.author?.username ? `/profile/${post.author.username}` : '#'} className="flex items-center gap-3">
          {post.author?.image ? (
            <img src={post.author.image} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          )}
        </a>
        <div>
          <div className="font-semibold">
            <a href={post.author?.username ? `/profile/${post.author.username}` : '#'} className="hover:underline">{post.author?.name}</a> <span className="text-gray-500">@{post.author?.username}</span>
          </div>
          <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
        </div>
      </header>
      <p className="whitespace-pre-line">
        {renderMentions(post.content)}
      </p>
      {post.mediaUrl && post.mediaType === 'image' && (
        <img src={post.mediaUrl} alt="immagine" className="mt-3 w-full rounded-xl border" />
      )}
      {post.mediaUrl && post.mediaType === 'video' && (
        isYouTubeUrl(post.mediaUrl)
          ? (
            <div className="mt-3 w-full aspect-video rounded-xl border overflow-hidden">
              <iframe
                src={getYouTubeEmbedUrl(post.mediaUrl)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                title="YouTube video"
              />
            </div>
          )
          : (
            <video src={post.mediaUrl} controls className="mt-3 w-full rounded-xl border" />
          )
      )}
      <footer className="mt-3 flex items-center justify-between text-sm">
        {/* Likes a sinistra */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLike}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={t.like}
            title={t.like}
          >
            {liked ? (
              <FaHeart className="w-5 h-5 text-red-500" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <button
            onClick={() => setShowLikes(true)}
            className="px-2 py-0.5 rounded text-xs font-semibold text-gray-700 hover:bg-gray-100"
            aria-label="Vedi chi ha messo Mi Piace"
            title="Vedi Mi piace"
          >
            {likes}
          </button>
        </div>

        {/* Commenti a destra */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowComments(v => !v)}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label={t.comments}
            title={t.comments}
          >
            <BsChatDots className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-xs font-semibold text-gray-700">{comments}</span>
        </div>
        {showLikes && <LikesModal postId={post.id} onClose={() => setShowLikes(false)} />}
      </footer>
    <form onSubmit={addComment} className="mt-2 flex gap-2 relative">
        <input value={comment} onChange={e=>{
          const val = e.target.value
          setComment(val)
          const caret = e.target.selectionStart || val.length
          const upToCaret = val.slice(0, caret)
          const match = upToCaret.match(/@([a-zA-Z0-9_]{0,20})$/)
      if (match) { setMentionQuery(match[1] || ''); setMentionOpen(true) } else { setMentionOpen(false); setMentionQuery('') }
        }} placeholder={t.writeComment} className="flex-1 rounded-xl border px-3 py-2" />
  {mentionOpen && (
          <InlineMentionSuggestions
            query={mentionQuery}
            onPick={(u)=>{
              const val = comment
              const caret = val.length
              const upToCaret = val.slice(0, caret)
              const before = upToCaret.replace(/(@[a-zA-Z0-9_]{0,20})$/, `@${u.username} `)
              const after = val.slice(caret)
              setComment(before + after)
              setMentionOpen(false)
              setMentionQuery('')
            }}
          />
        )}
        <button
          aria-label={t.send}
          title={t.send}
          type="submit"
          disabled={!comment.trim() || commentPosting}
          className={`rounded-xl border px-3 py-2 flex items-center justify-center ${commentPosting ? 'opacity-60 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-50'}`}
        >
          <IoSend className="w-5 h-5" />
        </button>
      </form>

      {showComments && (
        <InlineComments postId={post.id} onReplyPosted={() => setComments(c => c + 1)} />
      )}
      </div>
    </article>
  )
}

// Helpers per YouTube
function isYouTubeUrl(url: string) {
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url)
}

function getYouTubeEmbedUrl(url: string) {
  // Supporta sia youtube.com/watch?v= che youtu.be/
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`
  }
  // fallback: restituisce l'url originale
  return url
}

function renderMentions(text: string) {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
  return parts.map((p, i) => {
    const m = p.match(/^@([a-zA-Z0-9_]+)$/);
    if (m) {
      const username = m[1];
      return <a key={i} href={`/profile/${username}`} className="text-purple-600 hover:underline">@{username}</a>;
    }
    return <span key={i}>{p}</span>;
  });
}

function InlineMentionSuggestions({ query, onPick }: { query: string; onPick: (u: any) => void }) {
  const [items, setItems] = useState<any[]>([])
  const ctrlRef = useRef<AbortController | null>(null)
  const cacheRef = useRef<Map<string, any[]>>(new Map())
  useEffect(() => {
    const q = (query || '').trim()
    if (q === '') { setItems([]); return }
    if (cacheRef.current.has(q)) { setItems(cacheRef.current.get(q) || []); return }
    ctrlRef.current?.abort()
    const ctrl = new AbortController()
    ctrlRef.current = ctrl
    const t = setTimeout(async () => {
      try {
        const res = await fetch('/api/friends?q=' + encodeURIComponent(q), { cache: 'no-store', signal: ctrl.signal })
        let users = await res.json().catch(() => [])
        if ((!Array.isArray(users) || users.length === 0) && q.length >= 2) {
          const r2 = await fetch('/api/search?q=' + encodeURIComponent(q), { cache: 'no-store', signal: ctrl.signal })
          const j2 = await r2.json().catch(() => ({ users: [] }))
          users = j2.users || []
        }
        users = Array.isArray(users) ? users.slice(0, 8) : []
        cacheRef.current.set(q, users)
        setItems(users)
      } catch { /* ignore */ }
    }, 180)
    return () => { clearTimeout(t); ctrl.abort() }
  }, [query])
  if (!items.length) return null
  return (
    <div className="absolute left-0 right-16 bottom-full mb-2 z-50 rounded-xl border bg-white shadow">
      <ul className="max-h-56 overflow-auto py-1">
        {items.map((u:any) => (
          <li key={u.id}>
            <button
              type="button"
              onClick={() => onPick(u)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 text-left"
            >
              {u.image ? (
                <img src={u.image} alt={u.username} className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <span className="h-6 w-6 rounded-full bg-gray-200 inline-block" />
              )}
              <span className="font-medium">{u.name || u.username}</span>
              <span className="text-gray-500">@{u.username}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function InlineComments({ postId, onReplyPosted }: { postId: string; onReplyPosted: () => void }) {
  const { lang } = useContext(LanguageContext)
  const t = translations[lang as keyof typeof translations] || translations.it
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyFor, setReplyFor] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replyPosting, setReplyPosting] = useState(false)

  useEffect(() => {
    let timer: any
    const load = async () => {
      try {
        setError(null)
        const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, { cache: 'no-store' })
        if (!res.ok) {
          setError(`Errore ${res.status}`)
          setItems([])
        } else {
          const data = await res.json().catch(() => [])
          setItems(Array.isArray(data) ? data : [])
        }
      } catch {
        setError('Errore di rete')
      } finally {
        setLoading(false)
      }
    }
    load()
  timer = setInterval(load, 5000)
    return () => clearInterval(timer)
  }, [postId])

  const grouped = useMemo(() => {
    const byParent: Record<string, any[]> = {}
    for (const c of items) {
      const key = (c as any).parentId || 'root'
      if (!byParent[key]) byParent[key] = []
      byParent[key].push(c)
    }
    return { roots: byParent['root'] || [], byParent }
  }, [items])

  async function sendReply(parentId: string) {
    if (!replyText.trim()) return
  if (replyPosting) return
  setReplyPosting(true)
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content: replyText, parentCommentId: parentId })
    })
    if (res.ok) {
      setReplyFor(null)
      setReplyText('')
      onReplyPosted()
      // refresh list
      try {
        const r = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, { cache: 'no-store' })
        if (r.ok) setItems(await r.json())
      } catch {}
    }
  setReplyPosting(false)
  }

  return (
    <div className="mt-3 rounded-xl border bg-gray-50 p-3">
      {loading ? (
        <div className="text-sm text-gray-500">{t.loading}</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">{error ? error : t.noComments}</div>
      ) : (
        <div className="space-y-3">
          {grouped.roots.map((c: any) => (
            <div key={c.id} className="border-b pb-2 last:border-b-0">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="font-semibold text-sm">{c.author?.name || t.anonymous} <span className="text-[11px] text-gray-400">@{c.author?.username}</span></div>
                  <div className="text-sm text-gray-700">{renderMentions(c.content)}</div>
                  <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                </div>
                <button className="text-xs text-blue-600 hover:underline" onClick={() => { setReplyFor(c.id); setReplyText('') }}>{t.reply}</button>
              </div>
              {replyFor === c.id && (
                <form onSubmit={(e) => { e.preventDefault(); sendReply(c.id); }} className="mt-2 flex gap-2">
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
                  <button disabled={!replyText.trim() || replyPosting} className="rounded-xl border px-3 py-1.5 text-sm disabled:opacity-60">{t.send}</button>
                </form>
              )}
              {(grouped.byParent[c.id] || []).map((rc: any) => (
                <div key={rc.id} className="mt-2 ml-4 pl-3 border-l space-y-1">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{rc.author?.name || t.anonymous} <span className="text-[10px] text-gray-400">@{rc.author?.username}</span></div>
                      <div className="text-sm text-gray-700">{renderMentions(rc.content)}</div>
                      <div className="text-xs text-gray-400">{rc.createdAt ? new Date(rc.createdAt).toLocaleString() : ''}</div>
                    </div>
                    <button className="text-[11px] text-blue-600 hover:underline" onClick={() => { setReplyFor(rc.id); setReplyText('') }}>{t.reply}</button>
                  </div>
                  {replyFor === rc.id && (
                    <form onSubmit={(e) => { e.preventDefault(); sendReply(rc.id); }} className="mt-2 flex gap-2">
                      <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
                      <button disabled={!replyText.trim() || replyPosting} className="rounded-xl border px-3 py-1.5 text-sm disabled:opacity-60">{t.send}</button>
                    </form>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

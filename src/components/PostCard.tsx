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
import ImageLightbox from './ImageLightbox'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { FiTrash2 } from 'react-icons/fi'

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
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const { data: session } = useSession()
  const isOwner = session?.user && (session.user as any).id === post.authorId

  const { lang } = useContext(LanguageContext)
  const t = translations[lang as keyof typeof translations] || translations.it

  // Mantieni i contatori allineati con gli aggiornamenti che arrivano dal server (Feed refresh)
  useEffect(() => {
    const next = post._count?.likes ?? 0
    setLikes((prev) => (prev !== next ? next : prev))
  }, [post.id, post._count?.likes])
  useEffect(() => {
    const next = post._count?.comments ?? 0
    setComments((prev) => (prev !== next ? next : prev))
  }, [post.id, post._count?.comments])

  async function handleDelete() {
    if (deleting) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
      if (res.ok) {
        // chiudi modal e ricarica
        setShowDelete(false)
        window.location.reload()
      } else {
        const j = await res.json().catch(() => ({} as any))
        setDeleteError(j.error || `Errore ${res.status}`)
      }
    } finally {
      setDeleting(false)
    }
  }

  const [liked, setLiked] = useState(post.liked ?? false);
  const [showLikes, setShowLikes] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startXRef = useRef<number | null>(null);
  async function toggleLike() {
    const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
    if (!res.ok) return
    const data = await res.json()
    // Aggiorna in modo ottimistico
    setLikes(v => v + (data.liked ? 1 : -1))
    setLiked(data.liked)
    // Poi riallinea con il server (contatore reale), per evitare mismatch quando altri mettono like
    try {
      const r = await fetch('/api/posts?authorId=' + encodeURIComponent(post.authorId), { cache: 'no-store' })
      if (r.ok) {
        const arr = await r.json()
        const updated = Array.isArray(arr) ? arr.find((p: any) => p.id === post.id) : null
        if (updated?._count?.likes != null) setLikes(updated._count.likes)
      }
    } catch {}
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim() || commentPosting) return
    setCommentPosting(true)
    const res = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ postId: post.id, content: comment }) })
    if (res.ok) {
      setComments(c => c + 1)
      setComment('')
      // Riallinea con il server
      try {
        const r = await fetch('/api/posts?authorId=' + encodeURIComponent(post.authorId), { cache: 'no-store' })
        if (r.ok) {
          const arr = await r.json()
          const updated = Array.isArray(arr) ? arr.find((p: any) => p.id === post.id) : null
          if (updated?._count?.comments != null) setComments(updated._count.comments)
        }
      } catch {}
    }
    setCommentPosting(false)
  }

  return (
    <>
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
        <DeleteConfirmModal error={deleteError || undefined} loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
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
      {Array.isArray(post.media) && post.media.length > 1 && (post.media[0]?.type === 'image' || !post.media[0]?.type) && (
        <div className="mt-3">
          <div className="relative overflow-hidden rounded-xl border">
            <div
              className="flex transition-transform duration-300"
              style={{ transform: `translateX(calc(-${slide * 100}% + ${dragX}px))` }}
              onTouchStart={(e) => { startXRef.current = e.touches[0].clientX; setDragX(0) }}
              onTouchMove={(e) => {
                if (startXRef.current == null) return
                const dx = e.touches[0].clientX - startXRef.current
                setDragX(dx)
              }}
              onTouchEnd={() => {
                const threshold = 40
                if (Math.abs(dragX) > threshold) {
                  if (dragX < 0) setSlide(s => Math.min(post.media.length - 1, s + 1))
                  else setSlide(s => Math.max(0, s - 1))
                }
                setDragX(0); startXRef.current = null
              }}
            >
              {post.media.map((m: any, idx: number) => (
                <div key={m.id || idx} className="w-full shrink-0 grow-0 basis-full">
                  <img src={m.url} alt={`image-${idx}`} className="w-full h-auto object-contain" />
                </div>
              ))}
            </div>
            {/* Prev/Next touch zones */}
            <button type="button" className="absolute inset-y-0 left-0 w-1/4" onClick={() => setSlide(s => Math.max(0, s - 1))} aria-label="Prev" />
            <button type="button" className="absolute inset-y-0 right-0 w-1/4" onClick={() => setSlide(s => Math.min(post.media.length - 1, s + 1))} aria-label="Next" />
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            {post.media.map((_: any, i: number) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`Vai a immagine ${i+1}`} className={`h-2 w-2 rounded-full ${i===slide ? 'bg-purple-600' : 'bg-white border border-purple-600'}`} />
            ))}
          </div>
        </div>
      )}
      {post.mediaUrl && post.mediaType === 'image' && (!post.media || post.media.length <= 1) && (
        <button className="mt-3 block group" onClick={()=>setLightboxOpen(true)} aria-label="Apri immagine a schermo intero">
          <img src={post.mediaUrl} alt="immagine" className="w-full rounded-xl border group-hover:opacity-95 transition" />
        </button>
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
      {lightboxOpen && post.mediaUrl && post.mediaType === 'image' && (
        <ImageLightbox src={post.mediaUrl} alt="immagine" onClose={() => setLightboxOpen(false)} />
      )}
    </>
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
  const { data: session } = useSession()
  const replyingRef = useRef(false)
  useEffect(() => { replyingRef.current = !!replyFor }, [replyFor])

  useEffect(() => {
    let timer: any
    const load = async () => {
      try {
        setError(null)
        const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, { cache: 'no-store' })
        if (!res.ok) {
          setError(`Errore ${res.status}`)
          if (!replyingRef.current) setItems([])
        } else {
          const data = await res.json().catch(() => [])
          if (!replyingRef.current) setItems(Array.isArray(data) ? data : [])
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

  const byParent = useMemo(() => {
    const map: Record<string, any[]> = {}
    for (const c of items) {
      const key = (c as any).parentId || 'root'
      if (!map[key]) map[key] = []
      map[key].push(c)
    }
    return map
  }, [items])

  const refresh = async () => {
    try {
      const r = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}`, { cache: 'no-store' })
      if (r.ok) setItems(await r.json())
    } catch {}
  }

  const toggleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, { method: 'POST' })
      if (!res.ok) return
      const data = await res.json().catch(() => null)
      setItems(prev => prev.map(c => c.id === commentId ? {
        ...c,
        myLiked: data?.liked ?? !c.myLiked,
        likesCount: data?.likesCount ?? (c.myLiked ? Math.max(0, (c.likesCount || 0) - 1) : (c.likesCount || 0) + 1)
      } : c))
    } catch {}
  }

  const canDelete = (c: any) => (session?.user as any)?.id && c.authorId === (session?.user as any)?.id
  const onDelete = async (commentId: string) => {
    if (!confirm('Eliminare il commento?')) return
    const res = await fetch(`/api/comments?commentId=${encodeURIComponent(commentId)}`, { method: 'DELETE' })
    if (res.ok) await refresh()
  }

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
      try { await refresh() } catch {}
    }
    setReplyPosting(false)
  }

  const ReplyForm = ({ targetId }: { targetId: string }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    useEffect(() => { inputRef.current?.focus() }, [])
    return replyFor === targetId ? (
      <form onSubmit={(e)=>{ e.preventDefault(); sendReply(targetId) }} className="mt-2 flex gap-2">
        <input ref={inputRef} autoFocus value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
        <button disabled={!replyText.trim() || replyPosting} className="rounded-xl border px-3 py-1.5 text-sm disabled:opacity-60">{t.send}</button>
      </form>
    ) : null
  }

  const Thread = ({ c, depth = 0 }: { c: any; depth?: number }) => (
    <div className={
      depth === 0
        ? 'border-b pb-2 last:border-b-0'
        : depth === 1
          ? 'mt-2 pl-3 border-l-2 border-violet-400'
          : 'mt-2 pl-3'
    }>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className={depth === 0 ? 'font-semibold text-sm' : 'font-semibold text-sm'}>
            {c.author?.username ? (
              <a href={`/profile/${c.author.username}`} className="text-purple-600 hover:underline">
                {c.author?.name || c.author?.username}
              </a>
            ) : (
              <span>{c.author?.name || t.anonymous}</span>
            )}
            {c.author?.username && (
              <span className={depth === 0 ? 'ml-1 text-[11px] text-gray-400' : 'ml-1 text-[10px] text-gray-400'}>@{c.author.username}</span>
            )}
          </div>
          <div className="text-sm text-gray-700">{renderMentions(c.content)}</div>
          <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleLike(c.id)}
            className={`px-2 py-0.5 rounded-full border ${depth === 0 ? 'text-xs' : 'text-[11px]'} flex items-center gap-1 cursor-pointer ${c.myLiked ? 'border-purple-500 text-purple-600' : 'border-purple-300 text-purple-500'}`}
            style={{ borderWidth: 0.5 }}
            aria-label="Mi piace"
          >
            {c.myLiked ? <AiFillHeart className="text-purple-600" /> : <AiOutlineHeart className="text-purple-500" />}
            <span>{c.likesCount || 0}</span>
          </button>
          <button type="button" className={`${depth === 0 ? 'text-xs' : 'text-[11px]'} text-blue-600 hover:underline cursor-pointer`} onClick={() => { setReplyFor(c.id); setReplyText('') }}>{t.reply}</button>
          {canDelete(c) && (
            <button type="button" className={`${depth === 0 ? 'text-xs' : 'text-[11px]'} text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer`} onClick={() => onDelete(c.id)} aria-label="Elimina commento">
              <FiTrash2 />
            </button>
          )}
        </div>
      </div>
      <ReplyForm targetId={c.id} />
      {(byParent[c.id] || []).map((child: any) => (
        <Thread key={child.id} c={child} depth={(depth || 0) + 1} />
      ))}
    </div>
  )

  return (
    <div className="mt-3 rounded-xl border bg-gray-50 p-3">
      {loading ? (
        <div className="text-sm text-gray-500">{t.loading}</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">{error ? error : t.noComments}</div>
      ) : (
        <div className="space-y-3">
          {(byParent['root'] || []).map((c: any) => (
            <Thread key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  )
}

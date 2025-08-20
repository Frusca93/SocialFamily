'use client'
import { useState, useContext, useEffect, useMemo } from 'react'
import LikesModal from './LikesModal'
import { LanguageContext } from '@/app/LanguageContext'
import { useSession } from 'next-auth/react'
import DeleteConfirmModal from './DeleteConfirmModal'
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
  const [showComments, setShowComments] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const { data: session } = useSession()
  const isOwner = session?.user && (session.user as any).id === post.authorId

  const { lang } = useContext(LanguageContext)
  const t = translations[lang as keyof typeof translations] || translations.it

  async function handleDelete() {
    const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
    if (res.ok) {
      window.location.reload()
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
    if (!comment.trim()) return
    const res = await fetch('/api/comments', { method: 'POST', body: JSON.stringify({ postId: post.id, content: comment }) })
    if (res.ok) { setComments(c => c + 1); setComment('') }
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
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      {showDelete && (
        <DeleteConfirmModal onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
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
      <p className="whitespace-pre-line">{post.content}</p>
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
      <form onSubmit={addComment} className="mt-2 flex gap-2">
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder={t.writeComment} className="flex-1 rounded-xl border px-3 py-2" />
        <button className="rounded-xl border px-3">{t.send}</button>
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

function InlineComments({ postId, onReplyPosted }: { postId: string; onReplyPosted: () => void }) {
  const { lang } = useContext(LanguageContext)
  const t = translations[lang as keyof typeof translations] || translations.it
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyFor, setReplyFor] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')

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
    timer = setInterval(load, 3000)
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
                  <div className="text-sm text-gray-700">{c.content}</div>
                  <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
                </div>
                <button className="text-xs text-blue-600 hover:underline" onClick={() => { setReplyFor(c.id); setReplyText('') }}>{t.reply}</button>
              </div>
              {replyFor === c.id && (
                <form onSubmit={(e) => { e.preventDefault(); sendReply(c.id); }} className="mt-2 flex gap-2">
                  <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
                  <button className="rounded-xl border px-3 py-1.5 text-sm">{t.send}</button>
                </form>
              )}
              {(grouped.byParent[c.id] || []).map((rc: any) => (
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
                    <form onSubmit={(e) => { e.preventDefault(); sendReply(rc.id); }} className="mt-2 flex gap-2">
                      <input value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t.writeReply} className="flex-1 rounded-xl border px-3 py-1.5 text-sm" />
                      <button className="rounded-xl border px-3 py-1.5 text-sm">{t.send}</button>
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

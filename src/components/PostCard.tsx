'use client'
import { useState, useContext } from 'react'
import LikesModal from './LikesModal'
import { LanguageContext } from '@/app/LanguageContext'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import DeleteConfirmModal from './DeleteConfirmModal'

const translations = {
  it: {
    delete: 'Elimina post',
    like: 'Mi piace',
    comments: 'Commenti',
    writeComment: 'Scrivi un commento',
    send: 'Invia',
  },
  en: {
    delete: 'Delete post',
    like: 'Like',
    comments: 'Comments',
    writeComment: 'Write a comment',
    send: 'Send',
  },
  fr: {
    delete: 'Supprimer le post',
    like: 'J’aime',
    comments: 'Commentaires',
    writeComment: 'Écrire un commentaire',
    send: 'Envoyer',
  },
  es: {
    delete: 'Eliminar publicación',
    like: 'Me gusta',
    comments: 'Comentarios',
    writeComment: 'Escribe un comentario',
    send: 'Enviar',
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
  // Lazy load CommentsModal to avoid SSR issues
  const CommentsModal = dynamic(() => import('./CommentsModal'), { ssr: false })

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
    <article className="relative rounded-2xl border bg-white p-4">
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
      <footer className="mt-3 flex items-center gap-4 text-sm">
        <button
          onClick={toggleLike}
          className="rounded-xl border px-3 py-1 flex items-center gap-2 group"
          aria-label={t.like}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={liked ? '#ef4444' : 'none'}
            stroke={liked ? '#ef4444' : 'black'}
            strokeWidth={1.5}
            className="w-6 h-6 transition-colors"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 3.75c-1.74 0-3.41 1.01-4.5 2.62C10.91 4.76 9.24 3.75 7.5 3.75 4.42 3.75 2 6.16 2 9.21c0 3.4 3.4 6.13 8.55 10.29a1.5 1.5 0 0 0 1.9 0C18.6 15.34 22 12.61 22 9.21c0-3.05-2.42-5.46-5.5-5.46z"
            />
          </svg>
        </button>
        <button
          onClick={() => setShowLikes(true)}
          className="ml-1 px-2 py-0.5 rounded-full border text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 transition"
          aria-label="Vedi chi ha messo Mi Piace"
        >
          {likes}
        </button>
        <button onClick={() => setShowComments(true)} className="rounded-xl border px-3 py-1">{t.comments}: {comments}</button>
        {showLikes && <LikesModal postId={post.id} onClose={() => setShowLikes(false)} />}
      </footer>
      <form onSubmit={addComment} className="mt-2 flex gap-2">
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder={t.writeComment} className="flex-1 rounded-xl border px-3 py-2" />
        <button className="rounded-xl border px-3">{t.send}</button>
      </form>

      {showComments && (
        <CommentsModal postId={post.id} onClose={() => setShowComments(false)} />
      )}
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



"use client"
import React, { useEffect, useRef, useContext } from "react"
import { LanguageContext } from '@/app/LanguageContext'

const translations = {
  it: {
    title: "Commenti",
    loading: "Caricamento...",
    noComments: "Nessun commento",
    anonymous: "Anonimo"
  },
  en: {
    title: "Comments",
    loading: "Loading...",
    noComments: "No comments",
    anonymous: "Anonymous"
  },
  fr: {
    title: "Commentaires",
    loading: "Chargement...",
    noComments: "Aucun commentaire",
    anonymous: "Anonyme"
  },
  es: {
    title: "Comentarios",
    loading: "Cargando...",
    noComments: "Sin comentarios",
    anonymous: "Anónimo"
  }
}

export default function CommentsModal({ postId, onClose }: { postId: string, onClose: () => void }) {
  const [comments, setComments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
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
            comments.map((c, i) => (
              <div key={c.id || i} className="border-b pb-2">
                <div className="font-semibold">{c.author?.name || t.anonymous} <span className="text-xs text-gray-400">@{c.author?.username}</span></div>
                <div className="text-sm text-gray-700">{c.content}</div>
                <div className="text-xs text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

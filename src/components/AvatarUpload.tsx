"use client"
import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function AvatarUpload() {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        // Refresh the page data to update avatar
        router.refresh()
        // Optionally clear the file input
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        setError('Errore durante l\'upload')
      }
    })
  }

  return (
    <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        disabled={isPending}
      />
      <button
        className="rounded-xl border bg-blue-600 px-3 py-2 text-white"
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
      >
        Carica dal dispositivo
      </button>
      {error && <span className="text-red-500 text-sm ml-2">{error}</span>}
    </form>
  )
}

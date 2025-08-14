'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const token = sp?.get('token') || ''
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null)
    if (!token) { setErr('Token mancante'); return }
    if (p1.length < 6) { setErr('Minimo 6 caratteri'); return }
    if (p1 !== p2) { setErr('Le password non coincidono'); return }
    setLoading(true)
    const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: p1 }) })
    setLoading(false)
    if (!res.ok) { setErr((await res.json()).error || 'Errore'); return }
    router.push('/login')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Reimposta password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Nuova password" type="password" value={p1} onChange={e=>setP1(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="Ripeti password" type="password" value={p2} onChange={e=>setP2(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white disabled:opacity-50">{loading ? '...' : 'Reset password'}</button>
      </form>
    </div>
  )
}

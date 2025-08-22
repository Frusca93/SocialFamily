'use client'
import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setMsg(null); setErr(null)
    const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    if (!res.ok) setErr('Errore invio email'); else setMsg('Se l’email esiste riceverai un link di reset')
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="flex flex-col items-center">
        <img src="/Alora.png" alt="Alora" className="h-16 w-16" />
        <div className="mt-2 text-3xl font-bold text-purple-600">Alora</div>
      </div>
      <h1 className="mt-6 mb-4 text-center text-xl font-semibold">Recupero password</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 p-3 font-semibold text-white disabled:opacity-50">{loading ? '...' : 'Invia email'}</button>
      </form>
    </div>
  )
}

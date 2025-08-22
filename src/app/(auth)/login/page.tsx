'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      setError(res.error === 'EMAIL_NOT_VERIFIED' ? 'Email non verificata. Controlla la posta.' : 'Credenziali non valide')
    } else {
      window.location.href = '/'
    }
    setLoading(false)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="flex flex-col items-center">
        <img src="/Alora.png" alt="Alora" className="h-16 w-16" />
        <div className="mt-2 text-3xl font-bold text-purple-600">Alora</div>
      </div>
      <h1 className="mt-6 mb-4 text-center text-xl font-semibold">Accedi</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="Password" type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 p-3 font-semibold text-white disabled:opacity-50">{loading ? '...' : 'Entra'}</button>
      </form>
      <div className="mt-4 text-sm flex justify-between">
        <span>Nuovo qui? <Link className="text-purple-600 underline" href="/register">Registrati</Link></span>
        <Link className="text-purple-600 underline" href="/forgot-password">Password dimenticata?</Link>
      </div>
    </div>
  )
}

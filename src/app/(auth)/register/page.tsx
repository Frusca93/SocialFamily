'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const usernameHasSpace = /\s/.test(form.username)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (usernameHasSpace) {
      setErr("L'username non deve contenere spazi")
      return
    }
    const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(form) })
    if (!res.ok) { setErr((await res.json()).error || 'Errore'); return }
    setOk(true)
    window.location.href = '/login'
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="flex flex-col items-center">
        <img src="/Alora.png" alt="Alora" className="h-16 w-16" />
        <div className="mt-2 text-3xl font-bold text-purple-600">Alora</div>
      </div>
      <h1 className="mt-6 mb-4 text-center text-xl font-semibold">Crea account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Nome" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
        <div>
          <input
            className={`w-full rounded-xl border p-3 ${usernameHasSpace ? 'border-red-500' : ''}`}
            placeholder="Username"
            value={form.username}
            onChange={e=>setForm(f=>({...f,username:e.target.value}))}
          />
          {usernameHasSpace && (
            <p className="mt-1 text-xs text-red-600">L'username non deve contenere spazi</p>
          )}
        </div>
        <input className="w-full rounded-xl border p-3" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        <input className="w-full rounded-xl border p-3" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button disabled={usernameHasSpace} className="w-full rounded-xl bg-purple-600 hover:bg-purple-700 p-3 font-semibold text-white disabled:opacity-50">Registrati</button>
      </form>
    </div>
  )
}

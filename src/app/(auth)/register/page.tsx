'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const res = await fetch('/api/auth/register', { method: 'POST', body: JSON.stringify(form) })
    if (!res.ok) { setErr((await res.json()).error || 'Errore'); return }
    setOk(true)
    window.location.href = '/login'
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Crea account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Nome" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
        <input className="w-full rounded-xl border p-3" placeholder="Username" value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))} />
        <input className="w-full rounded-xl border p-3" placeholder="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        <input className="w-full rounded-xl border p-3" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white">Registrati</button>
      </form>
    </div>
  )
}

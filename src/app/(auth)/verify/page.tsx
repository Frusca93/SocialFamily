import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

function VerifyClient() {
  'use client'
  const sp = useSearchParams()
  const token = sp?.get('token') || ''

  useEffect(() => {
    if (token) {
      // Passa al route API che consuma il token e fa redirect alla login
      window.location.replace(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
    }
  }, [token])

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-2xl font-semibold">Verifica email</h1>
      {token ? (
        <p>Reindirizzamento in corso...</p>
      ) : (
        <p>Controlla la tua casella email e clicca sul link per confermare. Dopo la conferma verrai portato alla login.</p>
      )}
    </div>
  )
}

export default function VerifyInfoPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16">Caricamento…</div>}>
      <VerifyClient />
    </Suspense>
  )
}

import { Suspense } from 'react'
import VerifyClient from './VerifyClient'

export const dynamic = 'force-dynamic'

export default function VerifyInfoPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-4 py-16">Caricamento…</div>}>
      <VerifyClient />
    </Suspense>
  )
}

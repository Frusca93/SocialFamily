'use client'
import { useState } from 'react'

type FollowState = 'none' | 'pending' | 'approved' | 'declined';

export default function FollowButton({ targetUserId, initialFollowing = false, initialRequestStatus }: { targetUserId: string, initialFollowing?: boolean, initialRequestStatus?: FollowState }){
  const [following, setFollowing] = useState(initialFollowing)
  const [requestStatus, setRequestStatus] = useState<FollowState>(initialRequestStatus || (initialFollowing ? 'approved' : 'none'))
  const [loading, setLoading] = useState(false)

  async function handleRequest(){
    setLoading(true)
    const res = await fetch('/api/follow-request', { method: 'POST', body: JSON.stringify({ targetUserId }) })
    setLoading(false)
    if (res.ok) setRequestStatus('pending')
    else {
      const data = await res.json().catch(()=>null)
      if(data?.error?.includes('già inviata')) setRequestStatus('pending')
    }
  }

  if (following || requestStatus === 'approved') {
    return <button disabled className="rounded-xl border bg-white px-3 py-2 opacity-60">Segui già</button>
  }
  if (requestStatus === 'pending') {
    return <button disabled className="rounded-xl border bg-white px-3 py-2 opacity-60">Richiesta inviata</button>
  }
  if (requestStatus === 'declined') {
    return <button disabled className="rounded-xl border bg-white px-3 py-2 opacity-60">Richiesta rifiutata</button>
  }
  return (
    <button onClick={handleRequest} disabled={loading} className="rounded-xl border bg-white px-3 py-2 disabled:opacity-50">
      Richiedi di seguire
    </button>
  )
}

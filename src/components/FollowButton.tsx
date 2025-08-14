'use client'
import { useEffect, useState } from 'react'

type FollowState = 'none' | 'pending' | 'approved' | 'declined';

export default function FollowButton({ targetUserId, initialFollowing = false, initialRequestStatus }: { targetUserId: string, initialFollowing?: boolean, initialRequestStatus?: FollowState }){
  const [following, setFollowing] = useState(initialFollowing)
  const [requestStatus, setRequestStatus] = useState<FollowState>(initialRequestStatus || (initialFollowing ? 'approved' : 'none'))
  const [loading, setLoading] = useState(false)

  // Normalizza stati incoerenti: se non stai seguendo ma risulta 'approved', resetta a 'none'
  useEffect(() => {
    if (!following && requestStatus === 'approved') {
      setRequestStatus('none');
    }
    if (following && requestStatus !== 'approved') {
      setRequestStatus('approved');
    }
  }, [following, requestStatus]);


  async function handleRequest(){
    setLoading(true)
    const res = await fetch('/api/follow-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId })
    })
    const data = await res.json().catch(()=>null)
    setLoading(false)
    if (res.ok) {
      setRequestStatus('pending')
    } else {
      if (data?.status === 'already-following') {
        setFollowing(true)
        setRequestStatus('approved')
        return
      }
      if (data?.status === 'already-pending' || data?.status === 'pending') {
        setRequestStatus('pending')
        return
      }
      if (data?.error?.toLowerCase().includes('not following') || data?.error?.toLowerCase().includes('non segui')) {
        setFollowing(false);
        setRequestStatus('none');
        return
      }
      // Fallback: imposta pending se il server ha aggiornato a pending
      if (data?.status === 'updated-to-pending') {
        setRequestStatus('pending')
      }
    }
  }

  if (following) {
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

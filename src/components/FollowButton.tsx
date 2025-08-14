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
    setLoading(false)
    if (res.ok) setRequestStatus('pending')
    else {
      const data = await res.json().catch(()=>null)
      if(data?.error?.includes('già inviata')) setRequestStatus('pending')
      // Se il backend risponde che non segui più, resetta lo stato
      if(data?.error?.toLowerCase().includes('not following') || data?.error?.toLowerCase().includes('non segui')) {
        setFollowing(false);
        setRequestStatus('none');
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

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import MessagesClient from '@/components/MessagesClient'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return <div className="p-6">Devi effettuare il login</div>
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 py-2 sm:py-3">
        <Link href="/" className="mr-1 rounded-full p-2 hover:bg-gray-100" aria-label="Torna alla home">←</Link>
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">Messaggi</h1>
      </div>
      <MessagesClient />
    </div>
  )
}

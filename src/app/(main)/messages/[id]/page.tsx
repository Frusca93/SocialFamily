import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import ChatClient, { ChatHeader } from '@/components/ChatClient'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return <div className="p-6">Devi effettuare il login</div>
  }
  return (
    <div className="flex h-[calc(100dvh-var(--safe-top)-var(--safe-bottom)-6.5rem)] flex-col overflow-hidden rounded-2xl border bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-white px-2 py-2">
        <Link href="/messages" className="rounded-full p-2 hover:bg-gray-100" aria-label="Indietro">
          ←
        </Link>
  <ChatHeader conversationId={params.id} />
        <div className="w-8" />
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChatClient conversationId={params.id} />
      </div>
    </div>
  )
}

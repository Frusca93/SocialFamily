import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import MessagesClient from '@/components/MessagesClient'
import { prisma } from '@/lib/prisma'
import MessagesTitle from '../../../components/MessagesTitle'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return <div className="p-6">Devi effettuare il login</div>
  }
  const userId = (session.user as any).id as string
  // Precarica conversazioni lato server per render immediato
  const convs = await (prisma as any).conversation.findMany({
    where: { participants: { some: { userId } } },
    orderBy: { updatedAt: 'desc' },
    include: {
      participants: { include: { user: { select: { id: true, name: true, username: true, image: true } } } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })
  const ids = convs.map((c: any) => c.id)
  const unreadGroups = ids.length ? await (prisma as any).message.groupBy({
    by: ['conversationId'],
    where: { conversationId: { in: ids }, senderId: { not: userId }, readAt: null },
    _count: { _all: true }
  }) : []
  const unreadMap = new Map<string, number>()
  for (const g of unreadGroups as any[]) unreadMap.set(g.conversationId, g._count._all)
  const initialItems = convs.map((c: any) => {
    const other = c.participants.map((p: any) => p.user).find((u: any) => u.id !== userId) || c.participants[0]?.user
    return { id: c.id, other, last: c.messages[0] || null, unread: unreadMap.get(c.id) || 0 }
  })
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 py-2 sm:py-3">
        <Link href="/" className="mr-1 rounded-full p-2 hover:bg-gray-100" aria-label="Torna alla home">←</Link>
  <MessagesTitle />
      </div>
      <MessagesClient initialItems={initialItems} />
    </div>
  )
}

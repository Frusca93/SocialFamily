import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json([], { status: 401 })
  const userId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').toLowerCase()

  const convs = await (prisma as any).conversation.findMany({
    where: { participants: { some: { userId } } },
    orderBy: { updatedAt: 'desc' },
    include: {
      participants: { include: { user: { select: { id: true, name: true, username: true, image: true } } } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })

  const out = await Promise.all(convs.map(async (c: any) => {
    const other = c.participants.map(p => p.user).find(u => u.id !== userId) || c.participants[0]?.user
  const unread = await (prisma as any).message.count({ where: { conversationId: c.id, senderId: { not: userId }, readAt: null } })
    return { id: c.id, other, last: c.messages[0] || null, unread }
  }))

  const filtered = q
    ? out.filter(x => (x.other?.name || '').toLowerCase().includes(q) || (x.other?.username || '').toLowerCase().includes(q))
    : out
  return Response.json(filtered)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string
  const body = await req.json().catch(() => ({}))
  const targetUsername = (body.username as string || '').trim()
  if (!targetUsername) return Response.json({ error: 'username required' }, { status: 400 })
  const target = await prisma.user.findUnique({ where: { username: targetUsername } })
  if (!target) return Response.json({ error: 'not found' }, { status: 404 })
  if (target.id === userId) return Response.json({ error: 'self' }, { status: 400 })
  const existing = await (prisma as any).conversation.findFirst({
    where: { participants: { every: { userId: { in: [userId, target.id] } } } },
  })
  if (existing) return Response.json({ id: existing.id })
  const created = await (prisma as any).conversation.create({
    data: {
      participants: { create: [{ userId }, { userId: target.id }] }
    }
  })
  return Response.json({ id: created.id })
}

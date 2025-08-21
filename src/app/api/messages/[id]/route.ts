import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json([], { status: 401 })
  const userId = (session.user as any).id as string
  const id = params.id
  const conv = await (prisma as any).conversation.findFirst({
    where: { id, participants: { some: { userId } } },
    include: { messages: { orderBy: { createdAt: 'asc' } }, participants: { include: { user: { select: { id: true, name: true, username: true, image: true } } } } }
  })
  if (!conv) return Response.json([], { status: 404 })
  // mark as read
  await (prisma as any).message.updateMany({ where: { conversationId: id, senderId: { not: userId }, readAt: null }, data: { readAt: new Date() } })
  const other = conv.participants.map((p: any) => p.user).find((u: any) => u.id !== userId) || conv.participants[0]?.user
  return Response.json({ id: conv.id, messages: conv.messages, other, meId: userId })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string
  const id = params.id
  const body = await req.json().catch(() => ({}))
  const content = (body.content as string || '').trim()
  if (!content) return Response.json({ error: 'content' }, { status: 400 })
  const msg = await (prisma as any).message.create({ data: { conversationId: id, senderId: userId, content } })
  await (prisma as any).conversation.update({ where: { id }, data: { updatedAt: new Date() } })
  // Best-effort push notify the other participant
  try {
    const participants = await (prisma as any).conversationParticipant.findMany({ where: { conversationId: id } });
    const other = participants.find((p: any) => p.userId !== userId);
    if (other) {
      const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: other.userId } });
      const { sendPush } = await import('@/lib/webpush');
      await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
        title: 'Nuovo messaggio',
        body: content.length > 80 ? content.slice(0, 77) + '…' : content,
        url: `/messages/${id}`,
        icon: '/sf_logo.png',
        badge: '/sf_logo.png'
      })));
    }
  } catch {}
  return Response.json({ message: msg })
}

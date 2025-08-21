
import { prisma } from '@/lib/prisma'
import { sendPush } from '@/lib/webpush'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string
  const { postId } = params

  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } })
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    return Response.json({ liked: false })
  }
  const like = await prisma.like.create({ data: { userId, postId } })
  // Recupera il post e il suo autore
  const post = await prisma.post.findUnique({ where: { id: postId }, include: { author: true } })
  if (post && post.authorId !== userId) {
    // Crea la notifica nel DB
    const notification = await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: 'like',
        postId,
        fromUserId: userId,
        message: `${(session.user as any).name || 'Qualcuno'} ha messo Mi piace al tuo post`,
      }
    })
  // Notifiche realtime rimosse: ora non fa nulla
    // Push: avvisa l'autore del post
    try {
      const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: post.authorId } })
      const title = 'Nuovo like'
      const body = `${(session.user as any).name || 'Qualcuno'} ha messo Mi piace al tuo post`
      await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
        title,
        body,
        url: `/?post=${postId}`,
        icon: '/sf_logo.png',
        badge: '/sf_logo.png'
      })))
    } catch {}
  }
  return Response.json({ liked: true })
}

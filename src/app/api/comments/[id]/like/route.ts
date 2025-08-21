import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendPush } from '@/lib/webpush'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string
  const commentId = params.id
  if (!commentId) return Response.json({ error: 'Missing id' }, { status: 400 })

  // Ensure comment exists and get author + postId
  const comment = await prisma.comment.findUnique({ where: { id: commentId }, select: { id: true, authorId: true, postId: true } })
  if (!comment) return Response.json({ error: 'Not found' }, { status: 404 })

  // Toggle like
  const existing = await (prisma as any).commentLike.findUnique({ where: { userId_commentId: { userId, commentId } } }).catch(() => null)
  let liked = false
  if (existing) {
    await (prisma as any).commentLike.delete({ where: { id: existing.id } })
    liked = false
  } else {
    await (prisma as any).commentLike.create({ data: { userId, commentId } })
    liked = true
    // Notify comment author if not self
    if (comment.authorId !== userId) {
      try {
        const notif = await prisma.notification.create({
          data: {
            userId: comment.authorId,
            type: 'comment-like',
            postId: comment.postId,
            fromUserId: userId,
            message: `${(session.user as any).name || 'Qualcuno'} ha messo Mi piace al tuo commento`,
          }
        })
        try {
          const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: comment.authorId } })
          await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
            title: 'Nuovo Mi piace',
            body: notif.message || 'Hai ricevuto un nuovo Mi piace',
            url: `/?post=${comment.postId}`,
            icon: '/sf_logo.png',
            badge: '/sf_logo.png'
          })))
        } catch {}
      } catch {}
    }
  }

  const grouped = await (prisma as any).commentLike.groupBy({ by: ['commentId'], _count: { commentId: true }, where: { commentId: commentId } }).catch(() => [])
  const likesCount = grouped[0]?._count?.commentId || 0

  return Response.json({ liked, likesCount })
}

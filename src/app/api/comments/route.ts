
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendPush } from '@/lib/webpush'
import { commentSchema } from '@/lib/validations'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')
  if (!postId) return Response.json([])
  const comments = await prisma.comment.findMany({
    where: { postId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      postId: true,
      content: true,
      authorId: true,
      image: true,
      createdAt: true,
      author: { select: { name: true, username: true } }
    }
  })
  return Response.json(comments)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 })
  const { postId, content, parentCommentId } = parsed.data
  const data: any = { postId, content, authorId: (session.user as any).id }
  if (parentCommentId) data.parentId = parentCommentId
  const comment = await prisma.comment.create({ data })
  // Notifiche: se è una risposta, avvisa l'autore del commento originale; altrimenti avvisa l'autore del post
  try {
    if (parentCommentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentCommentId } })
      if (parent && parent.authorId !== (session.user as any).id) {
        const notif = await prisma.notification.create({
          data: {
            userId: parent.authorId,
            type: 'comment-reply',
            postId,
            fromUserId: (session.user as any).id,
            message: `${(session.user as any).name || 'Qualcuno'} ha risposto al tuo commento`,
          }
        })
        try {
          const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: parent.authorId } })
          await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
            title: 'Nuova risposta',
            body: notif.message,
            url: `/?post=${postId}`,
            icon: '/sf_logo.png',
            badge: '/sf_logo.png'
          })))
        } catch {}
      }
    } else {
      const post = await prisma.post.findUnique({ where: { id: postId }, include: { author: true } })
      if (post && post.authorId !== (session.user as any).id) {
        const notif = await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'comment',
            postId,
            fromUserId: (session.user as any).id,
            message: `${(session.user as any).name || 'Qualcuno'} ha commentato il tuo post`,
          }
        })
        try {
          const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: post.authorId } })
          await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
            title: 'Nuovo commento',
            body: notif.message,
            url: `/?post=${postId}`,
            icon: '/sf_logo.png',
            badge: '/sf_logo.png'
          })))
        } catch {}
      }
    }
  } catch {}
  // Notifiche menzioni nel commento
  try {
    const usernames = Array.from(new Set((content.match(/@([a-zA-Z0-9_]+)/g) || []).map((s: string) => s.slice(1))));
    if (usernames.length) {
      const users = await prisma.user.findMany({ where: { username: { in: usernames } }, select: { id: true } });
      await Promise.all(users
        .filter(u => u.id !== (session.user as any).id)
        .map(u => prisma.notification.create({
          data: {
            userId: u.id,
            type: 'mention',
            postId,
            fromUserId: (session.user as any).id,
            message: `${(session.user as any).name || 'Qualcuno'} ti ha menzionato in un commento`,
          }
        }))
      );
      // Push per le menzioni
      try {
        const mentionTargets = users.filter(u => u.id !== (session.user as any).id)
        for (const u of mentionTargets) {
          const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: u.id } })
          await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
            title: 'Sei stato menzionato',
            body: `${(session.user as any).name || 'Qualcuno'} ti ha menzionato in un commento`,
            url: `/?post=${postId}`,
            icon: '/sf_logo.png',
            badge: '/sf_logo.png'
          })))
        }
      } catch {}
    }
  } catch {}
  return Response.json(comment)
}

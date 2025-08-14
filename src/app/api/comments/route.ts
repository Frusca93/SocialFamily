
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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
  include: { author: { select: { name: true, username: true } } }
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
        await prisma.notification.create({
          data: {
            userId: parent.authorId,
            type: 'comment-reply',
            postId,
            fromUserId: (session.user as any).id,
            message: `${(session.user as any).name || 'Qualcuno'} ha risposto al tuo commento`,
          }
        })
      }
    } else {
      const post = await prisma.post.findUnique({ where: { id: postId }, include: { author: true } })
      if (post && post.authorId !== (session.user as any).id) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'comment',
            postId,
            fromUserId: (session.user as any).id,
            message: `${(session.user as any).name || 'Qualcuno'} ha commentato il tuo post`,
          }
        })
      }
    }
  } catch {}
  return Response.json(comment)
}

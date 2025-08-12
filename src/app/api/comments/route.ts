
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { commentSchema } from '@/lib/validations'
import { v2 as cloudinary } from 'cloudinary'
import { sendNotification } from '@/lib/notify'

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
  const { postId, content } = parsed.data
  const comment = await prisma.comment.create({ data: { postId, content, authorId: (session.user as any).id } })
  // Recupera il post e il suo autore
  const post = await prisma.post.findUnique({ where: { id: postId }, include: { author: true } })
  if (post && post.authorId !== (session.user as any).id) {
    const notification = await prisma.notification.create({
      data: {
        userId: post.authorId,
        type: 'comment',
        postId,
        fromUserId: (session.user as any).id,
        message: `${(session.user as any).name || 'Qualcuno'} ha commentato il tuo post`,
      }
    })
  await sendNotification(io || undefined, post.authorId, notification)
  }
  return Response.json(comment)
}

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
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { commentSchema } from '@/lib/validations'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const parsed = commentSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 })
  const { postId, content } = parsed.data
  const comment = await prisma.comment.create({ data: { postId, content, authorId: (session.user as any).id } })
  return Response.json(comment)
}

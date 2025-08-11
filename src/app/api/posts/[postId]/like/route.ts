import { prisma } from '@/lib/prisma'
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
  await prisma.like.create({ data: { userId, postId } })
  return Response.json({ liked: true })
}

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { targetUserId } = await req.json()
  const userId = (session.user as any).id as string

  if (targetUserId === userId) return Response.json({ error: 'Non puoi seguirti' }, { status: 400 })

  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: userId, followingId: targetUserId } } })
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return Response.json({ following: false })
  }
  await prisma.follow.create({ data: { followerId: userId, followingId: targetUserId } })
  return Response.json({ following: true })
}

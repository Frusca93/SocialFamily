import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ count: 0 }, { status: 200 })
  const userId = (session.user as any).id as string
  const count = await (prisma as any).message.count({ where: { senderId: { not: userId }, readAt: null, conversation: { participants: { some: { userId } } } } })
  return Response.json({ count })
}

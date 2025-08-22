import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''
  const followingOnly = searchParams.get('followingOnly') === '1'
  if (!q) return Response.json({ users: [], posts: [] })

  // Prepare filter for users list
  let userWhere: any = {
    OR: [
      { username: { contains: q, mode: 'insensitive' } },
      { name: { contains: q, mode: 'insensitive' } }
    ]
  }

  if (followingOnly) {
    const session = await getServerSession(authOptions)
    const meId = (session?.user as any)?.id as string | undefined
    if (!meId) {
      return Response.json({ users: [], posts: [] })
    }
    const follows = await prisma.follow.findMany({ where: { followerId: meId }, select: { followingId: true } })
    const ids = follows.map(f => f.followingId)
    if (ids.length === 0) {
      return Response.json({ users: [], posts: [] })
    }
    userWhere = { AND: [userWhere, { id: { in: ids } }] }
  }

  const [users, posts] = await Promise.all([
    prisma.user.findMany({ where: userWhere, take: 5, select: { id: true, name: true, username: true, image: true } }),
    prisma.post.findMany({
      where: { content: { contains: q, mode: 'insensitive' } },
      take: 5,
      include: { author: true }
    })
  ])
  return Response.json({ users, posts })
}

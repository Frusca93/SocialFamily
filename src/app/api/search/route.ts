import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim() || ''
  if (!q) return Response.json({ users: [], posts: [] })

  const [users, posts] = await Promise.all([
    prisma.user.findMany({ where: { OR: [{ username: { contains: q } }, { name: { contains: q } }] }, take: 5, select: { id: true, name: true, username: true, image: true } }),
    prisma.post.findMany({ where: { content: { contains: q } }, take: 5, include: { author: true } })
  ])
  return Response.json({ users, posts })
}

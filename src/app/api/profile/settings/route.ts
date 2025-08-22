import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, username, bio, language } = await req.json()
  if (!username || typeof username !== 'string') return Response.json({ error: 'Username non valido' }, { status: 400 })
  if (typeof name !== 'string' || name.trim().length < 1) return Response.json({ error: 'Nome non valido' }, { status: 400 })
  const meId = (session.user as any).id
  // Verifica unicità username se cambiato
  const current = await prisma.user.findUnique({ where: { id: meId }, select: { username: true } })
  if (current?.username !== username) {
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) return Response.json({ error: 'unique_username' }, { status: 409 })
  }

  const oldUsername = current?.username || ''

  await prisma.$transaction(async (tx) => {
    // Update user basic fields first
    await tx.user.update({ where: { id: meId }, data: { name, username, bio, language } })

    // If username changed, update mentions in text content: @old -> @new
    if (oldUsername && oldUsername !== username) {
      const boundary = '(^|[^A-Za-z0-9_])'
      const after = '(?![A-Za-z0-9_])'
      const pattern = `${boundary}@${oldUsername}${after}`
      const replacement = `\\1@${username}`

      // Posts
      await tx.$executeRaw`UPDATE "Post" SET "content" = regexp_replace("content", ${pattern}, ${replacement}, 'g') WHERE "content" ~ ${pattern}`
      // Comments
      await tx.$executeRaw`UPDATE "Comment" SET "content" = regexp_replace("content", ${pattern}, ${replacement}, 'g') WHERE "content" ~ ${pattern}`
      // Messages
      await tx.$executeRaw`UPDATE "Message" SET "content" = regexp_replace("content", ${pattern}, ${replacement}, 'g') WHERE "content" ~ ${pattern}`
      // Notifications.message (if present)
      await tx.$executeRaw`UPDATE "Notification" SET "message" = regexp_replace("message", ${pattern}, ${replacement}, 'g') WHERE "message" IS NOT NULL AND "message" ~ ${pattern}`
    }
  })
  return Response.json({ ok: true })
}

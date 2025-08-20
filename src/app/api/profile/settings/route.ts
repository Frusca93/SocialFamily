import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { username, bio, language } = await req.json()
  if (!username || typeof username !== 'string') return Response.json({ error: 'Username non valido' }, { status: 400 })
  const meId = (session.user as any).id
  // Verifica unicità username se cambiato
  const current = await prisma.user.findUnique({ where: { id: meId }, select: { username: true } })
  if (current?.username !== username) {
    const existing = await prisma.user.findUnique({ where: { username } })
    if (existing) return Response.json({ error: 'unique_username' }, { status: 409 })
  }
  await prisma.user.update({ where: { id: meId }, data: { username, bio, language } })
  return Response.json({ ok: true })
}

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { token, password } = await req.json().catch(() => ({}))
  if (!token || !password) return Response.json({ error: 'Dati mancanti' }, { status: 400 })
  const row = await (prisma as any).token.findUnique({ where: { token } })
  if (!row || row.type !== 'PASSWORD_RESET' || row.expiresAt < new Date()) {
    return Response.json({ error: 'Token non valido' }, { status: 400 })
  }
  const passwordHash = await hash(password, 10)
  await prisma.user.update({ where: { id: row.userId }, data: { passwordHash } })
  await (prisma as any).token.delete({ where: { id: row.id } })
  return Response.json({ ok: true })
}

import { prisma } from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { sendMail } from '@/lib/mailer'

export const dynamic = 'force-dynamic'

// mailer importato

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}))
  if (!email) return Response.json({ error: 'Email mancante' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return Response.json({ ok: true }) // non rivelare
  // Se già verificata, fine
  if ((user as any).emailVerified) return Response.json({ ok: true })
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1h
  await (prisma as any).token.create({ data: { token, type: 'EMAIL_VERIFY', userId: user.id, expiresAt: expires } })
  const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/auth/verify?token=${token}`
  await sendMail(user.email, 'Conferma la tua email', `Clicca per confermare: <a href="${url}">${url}</a>`)
  return Response.json({ ok: true })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token') || ''
  if (!token) return Response.json({ error: 'Token mancante' }, { status: 400 })
  const row = await (prisma as any).token.findUnique({ where: { token } })
  if (!row || row.type !== 'EMAIL_VERIFY' || row.expiresAt < new Date()) {
    return Response.json({ error: 'Token non valido' }, { status: 400 })
  }
  await prisma.user.update({ where: { id: row.userId }, data: { emailVerified: new Date() } as any })
  await (prisma as any).token.delete({ where: { id: row.id } })
  return Response.redirect(`${process.env.NEXT_PUBLIC_APP_URL || ''}/login`, 302)
}

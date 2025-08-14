import { prisma } from '@/lib/prisma'
import { sendMail } from '@/lib/mailer'
import { randomBytes } from 'crypto'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { email } = await req.json().catch(() => ({}))
  if (!email) return Response.json({ error: 'Email mancante' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email } })
  if (user) {
    const token = randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 1000 * 60 * 30) // 30m
    await (prisma as any).token.create({ data: { token, type: 'PASSWORD_RESET', userId: user.id, expiresAt: expires } })
    const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/reset-password?token=${token}`
    await sendMail(email, 'Reset password', `Clicca per reimpostare: <a href=\"${url}\">${url}</a>`)
  }
  return Response.json({ ok: true })
}

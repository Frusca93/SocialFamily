import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { hash } from 'bcryptjs'
import { randomBytes } from 'crypto'
import { sendMail } from '@/lib/mailer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 })

    const { name, username, email, password } = parsed.data

    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } })
    if (exists) return Response.json({ error: 'Email o username già in uso' }, { status: 409 })

    const passwordHash = await hash(password, 10)
  const user = await prisma.user.create({ data: { name, username, email, passwordHash } })
  // crea token verifica e invia email
  const token = randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60)
  await (prisma as any).token.create({ data: { token, type: 'EMAIL_VERIFY', userId: user.id, expiresAt: expires } })
  const url = `${process.env.NEXT_PUBLIC_APP_URL || ''}/auth/verify?token=${token}`
  await sendMail(user.email, 'Conferma la tua email', `Clicca per confermare: <a href="${url}">${url}</a>`)
  return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: 'Errore server' }, { status: 500 })
  }
}

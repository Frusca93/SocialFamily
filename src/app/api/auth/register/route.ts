import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validations'
import { hash } from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 })

    const { name, username, email, password } = parsed.data

    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } })
    if (exists) return Response.json({ error: 'Email o username già in uso' }, { status: 409 })

    const passwordHash = await hash(password, 10)
    await prisma.user.create({ data: { name, username, email, passwordHash } })
    return Response.json({ ok: true })
  } catch (e) {
    return Response.json({ error: 'Errore server' }, { status: 500 })
  }
}

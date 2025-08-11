import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return Response.json({ error: 'Nessun file' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const ext = file.name.split('.').pop() || 'png'
  const filename = `${(session.user as any).id}_${Date.now()}.${ext}`
  const filePath = path.join(process.cwd(), 'public', 'avatars', filename)
  await writeFile(filePath, buffer)

  const imageUrl = `/avatars/${filename}`
  await prisma.user.update({ where: { id: (session.user as any).id }, data: { image: imageUrl } })
  return Response.json({ ok: true, image: imageUrl })
}

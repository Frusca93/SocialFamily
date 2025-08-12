import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return Response.json({ error: 'Nessun file' }, { status: 400 })

  // Converti il file in base64
  const arrayBuffer = await file.arrayBuffer()
  const base64 = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`
  // Upload su Cloudinary
  const uploadRes = await cloudinary.uploader.upload(base64, { folder: 'avatars' })
  const imageUrl = uploadRes.secure_url
  await prisma.user.update({ where: { id: (session.user as any).id }, data: { image: imageUrl } })
  return Response.json({ ok: true, image: imageUrl })
}

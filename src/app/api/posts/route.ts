import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { postSchema } from '@/lib/validations'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true, _count: { select: { likes: true, comments: true } } }
  })
  return Response.json(posts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })


  const contentType = req.headers.get('content-type') || ''
  let content = ''
  let mediaUrl = ''
  let mediaType: string | undefined = undefined

  if (contentType.startsWith('multipart/form-data')) {
    const formData = await req.formData()
    content = formData.get('content')?.toString() || ''
    mediaType = formData.get('mediaType')?.toString() || undefined
    const file = formData.get('file') as File | null
    const urlFromForm = formData.get('mediaUrl')?.toString() || ''
    if (file && file.size > 0) {
      // Convert file to base64
      const buffer = Buffer.from(await file.arrayBuffer())
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
      // Upload to Cloudinary
      const folder = mediaType === 'video' ? 'post-videos' : 'post-images'
      const uploadRes = await cloudinary.uploader.upload(base64, { folder })
      mediaUrl = uploadRes.secure_url
    } else if (urlFromForm) {
      mediaUrl = urlFromForm
    }
  } else {
    const body = await req.json()
    content = body.content
    mediaUrl = body.mediaUrl
    mediaType = body.mediaType
  }

  if (!content.trim()) return Response.json({ error: 'Contenuto obbligatorio' }, { status: 400 })

  const post = await prisma.post.create({ data: { content, mediaUrl, mediaType, authorId: (session.user as any).id } })
  return Response.json(post)
}

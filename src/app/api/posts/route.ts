import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { postSchema } from '@/lib/validations'
import { randomBytes } from 'crypto'
import { writeFile } from 'fs/promises'
import path from 'path'

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
      const ext = path.extname(file.name) || (mediaType === 'video' ? '.mp4' : '.jpg')
      const fileName = `${randomBytes(8).toString('hex')}_${Date.now()}${ext}`
      const buffer = Buffer.from(await file.arrayBuffer())
      const folder = mediaType === 'video' ? 'post-videos' : 'post-images'
      const filePath = path.join(process.cwd(), 'public', folder, fileName)
      await writeFile(filePath, buffer)
      mediaUrl = `/${folder}/${fileName}`
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

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { postSchema } from '@/lib/validations'
import { v2 as cloudinary } from 'cloudinary'

function logError(...args: any[]) {
  try {
    // eslint-disable-next-line no-console
    console.error('[POSTS API]', ...args)
  } catch {}
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const authorId = searchParams.get('authorId') || undefined;
  let where: any = undefined;
  if (authorId) {
    where = { authorId };
  } else {
    // If no authorId, return feed of current user: self + following
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = (session?.user as any)?.id as string | undefined;
    if (userId) {
      const following = await prisma.follow.findMany({
        where: { followerId: userId },
        select: { followingId: true },
      });
      const ids = [userId, ...following.map(f => f.followingId)];
      where = { authorId: { in: ids } };
    }
  }
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: true, _count: { select: { likes: true, comments: true } } }
  })
  return Response.json(posts)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      logError('Unauthorized')
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
        try {
          const buffer = Buffer.from(await file.arrayBuffer())
          const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
          const folder = mediaType === 'video' ? 'post-videos' : 'post-images'
          const uploadRes = await cloudinary.uploader.upload(base64, { folder })
          mediaUrl = uploadRes.secure_url
        } catch (err) {
          logError('Errore upload Cloudinary (multipart):', err)
          return Response.json({ error: 'Errore upload immagine' }, { status: 500 })
        }
      } else if (urlFromForm) {
        mediaUrl = urlFromForm
      }
    } else {
      const body = await req.json();
      content = body.content;
      mediaType = body.mediaType;
      if (body.fileBase64) {
        const folder = mediaType === 'video' ? 'post-videos' : 'post-images';
        try {
          const uploadRes = await cloudinary.uploader.upload(body.fileBase64, { folder });
          mediaUrl = uploadRes.secure_url;
        } catch (err) {
          logError('Errore upload Cloudinary (fileBase64):', err)
          return Response.json({ error: 'Errore upload immagine' }, { status: 500 });
        }
      } else {
        mediaUrl = body.mediaUrl;
      }
    }

    if (!content.trim()) {
      logError('Contenuto obbligatorio mancante')
      return Response.json({ error: 'Contenuto obbligatorio' }, { status: 400 })
    }

    const post = await prisma.post.create({
      data: { content, mediaUrl, mediaType, authorId: (session.user as any).id },
      include: { author: true, _count: true, likes: true }
    });
  // Socket.io logic removed
    return Response.json(post)
  } catch (err) {
    logError('Errore generico POST /api/posts:', err)
    return Response.json({ error: 'Errore generico' }, { status: 500 })
  }
}

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendPush } from '@/lib/webpush'
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
  try {
    const posts = await (prisma as any).post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: true, _count: { select: { likes: true, comments: true } }, media: { orderBy: { order: 'asc' } } }
    })
    return Response.json(posts)
  } catch (e) {
    // Fallback per ambienti senza la relazione PostMedia ancora migrata
    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: true, _count: { select: { likes: true, comments: true } } }
    })
    return Response.json(posts)
  }
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
  let mediaUrls: string[] = []

    if (contentType.startsWith('multipart/form-data')) {
      const formData = await req.formData()
      content = formData.get('content')?.toString() || ''
      mediaType = formData.get('mediaType')?.toString() || undefined
      const urlFromForm = formData.get('mediaUrl')?.toString() || ''
      const files = formData.getAll('files') as File[]
      if (files && files.length > 0) {
        try {
          const folder = mediaType === 'video' ? 'post-videos' : 'post-images'
          const uploads = await Promise.all(files.map(async (f) => {
            const buffer = Buffer.from(await f.arrayBuffer())
            const base64 = `data:${f.type};base64,${buffer.toString('base64')}`
            return cloudinary.uploader.upload(base64, { folder })
          }))
          mediaUrls = uploads.map(u => u.secure_url)
          mediaUrl = mediaUrls[0] || ''
        } catch (err) {
          logError('Errore upload Cloudinary (multipart multi):', err)
          return Response.json({ error: 'Errore upload immagini' }, { status: 500 })
        }
      } else if (urlFromForm) {
        mediaUrl = urlFromForm
      }
    } else {
      const body = await req.json();
      content = body.content;
      mediaType = body.mediaType;
      if (Array.isArray(body.mediaUrls) && body.mediaUrls.length > 0) {
        mediaUrls = body.mediaUrls
        mediaUrl = mediaUrls[0]
      } else if (Array.isArray(body.filesBase64) && body.filesBase64.length > 0) {
        const folder = mediaType === 'video' ? 'post-videos' : 'post-images';
        try {
          const uploads = await Promise.all(
            body.filesBase64.map((b64: string) => cloudinary.uploader.upload(b64, { folder }))
          )
          mediaUrls = uploads.map(u => u.secure_url)
          mediaUrl = mediaUrls[0] || ''
        } catch (err) {
          logError('Errore upload Cloudinary (filesBase64):', err)
          return Response.json({ error: 'Errore upload immagini' }, { status: 500 });
        }
      } else if (body.fileBase64) {
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

    // Save multiple media if provided
    if (mediaUrls.length > 0) {
      try {
        await (prisma as any).postMedia.createMany({
          data: mediaUrls.map((url, idx) => ({ postId: post.id, url, type: mediaType, order: idx })),
        })
      } catch (e) { logError('Errore salvataggio PostMedia:', e) }
    }
    // Notifica i follower: quando pubblico un nuovo post, avvisa tutti i miei follower
    try {
      const authorId = (session.user as any).id as string
      const followers = await prisma.follow.findMany({
        where: { followingId: authorId },
        select: { followerId: true }
      })
      if (followers.length) {
        const msg = `${post.author?.name || 'Qualcuno'} ha pubblicato un nuovo post`
        // Crea notifiche nel DB per i follower
        try {
          await prisma.notification.createMany({
            data: followers.map(f => ({
              userId: f.followerId,
              type: 'new-post' as any,
              postId: post.id,
              fromUserId: authorId,
              message: msg,
            }))
          })
        } catch {}
        // Invia push ai follower
        try {
          for (const f of followers) {
            try {
              const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: f.followerId } })
              if (subs?.length) {
                await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
                  title: 'Nuovo post',
                  body: msg,
                  url: `/?post=${post.id}`,
                  icon: '/Alora.png',
                  badge: '/Alora.png'
                })))
              }
            } catch {}
          }
        } catch {}
      }
    } catch {}
    // Mentions notifications: find @username tokens in content
    try {
      const usernames = Array.from(new Set((content.match(/@([a-zA-Z0-9_]+)/g) || []).map((s: string) => s.slice(1))));
      if (usernames.length) {
        const users = await prisma.user.findMany({ where: { username: { in: usernames } }, select: { id: true } });
        await Promise.all(users
          .filter(u => u.id !== (session.user as any).id)
          .map(u => prisma.notification.create({
            data: {
              userId: u.id,
              type: 'mention',
              postId: post.id,
              fromUserId: (session.user as any).id,
              message: `${(session.user as any).name || 'Qualcuno'} ti ha menzionato in un post`,
            }
          }))
        );
        // Push per le menzioni nel post
        try {
          const mentionTargets = users.filter(u => u.id !== (session.user as any).id)
          for (const u of mentionTargets) {
            const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: u.id } })
            await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
              title: 'Sei stato menzionato',
              body: `${(session.user as any).name || 'Qualcuno'} ti ha menzionato in un post`,
              url: `/?post=${post.id}`,
              icon: '/sf_logo.png',
              badge: '/sf_logo.png'
            })))
          }
        } catch {}
      }
    } catch {}
  // Socket.io logic removed
    return Response.json(post)
  } catch (err) {
    logError('Errore generico POST /api/posts:', err)
    return Response.json({ error: 'Errore generico' }, { status: 500 })
  }
}

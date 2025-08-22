
import { prisma } from '@/lib/prisma';
import { sendPush } from '@/lib/webpush';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { followRequestSchema } from '@/lib/validations';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = followRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 });
  const { targetUserId } = body as { targetUserId: string };
  const requesterId = (session.user as any).id as string;

  if (targetUserId === requesterId) {
    return Response.json({ error: 'Non puoi seguirti' }, { status: 400 });
  }

  // Se già segui, non creare richieste
  const alreadyFollowing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: requesterId, followingId: targetUserId } }
  });
  if (alreadyFollowing) {
    return Response.json({ status: 'already-following' });
  }

  // Gestisci eventuale richiesta esistente
  const existingReq = await prisma.followRequest.findUnique({
    where: { requesterId_targetId: { requesterId, targetId: targetUserId } }
  });
  if (existingReq) {
    if (existingReq.status === 'pending') {
      return Response.json({ status: 'already-pending' });
    }
    // Se era declined/approved, riporta a pending
    await prisma.followRequest.update({
      where: { requesterId_targetId: { requesterId, targetId: targetUserId } },
      data: { status: 'pending' }
    });
    // Crea/aggiorna una notifica per il target
    if (targetUserId !== requesterId) {
      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: 'follow-request',
          fromUserId: requesterId,
          message: `${(session.user as any).name || 'Qualcuno'} ti ha inviato una richiesta di follow`,
        }
      }).catch(() => {});
      // Push fuori app
      try {
        const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: targetUserId } });
        if (subs?.length) {
          await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
            title: 'Nuova richiesta di follow',
            body: `${(session.user as any).name || 'Qualcuno'} vuole seguirti`,
            url: `/`,
            icon: '/Alora.png',
            badge: '/Alora.png'
          })));
        }
      } catch {}
    }
    return Response.json({ status: 'updated-to-pending' });
  }

  // Crea la richiesta di follow
  const followRequest = await prisma.followRequest.create({
    data: {
      requesterId,
      targetId: targetUserId,
      status: 'pending',
    }
  });
  // Notifica al target user
  if (targetUserId !== requesterId) {
    await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'follow-request',
        fromUserId: requesterId,
        message: `${(session.user as any).name || 'Qualcuno'} ti ha inviato una richiesta di follow`,
      }
    }).catch(() => {});
    // Push fuori app
    try {
      const subs = await (prisma as any).pushSubscription.findMany({ where: { userId: targetUserId } });
      if (subs?.length) {
        await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, {
          title: 'Nuova richiesta di follow',
          body: `${(session.user as any).name || 'Qualcuno'} vuole seguirti`,
          url: `/`,
          icon: '/Alora.png',
          badge: '/Alora.png'
        })));
      }
    } catch {}
  }
  return Response.json({ status: 'pending', followRequest });
}


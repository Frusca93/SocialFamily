import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json([], { status: 401 });
  const userId = (session.user as any).id;
  // Notifiche: richieste follow in attesa
  const requests = await prisma.followRequest.findMany({
    where: { targetId: userId, status: 'pending' },
    include: { requester: { select: { id: true, name: true, username: true, image: true } } },
    orderBy: { createdAt: 'desc' }
  });
  const followNotifications = requests.map(r => ({
    id: r.id,
    type: 'follow-request',
    message: `${r.requester.name || 'Qualcuno'} ti ha inviato una richiesta di follow`,
    createdAt: r.createdAt,
    fromUserId: r.requesterId,
    requester: r.requester,
    postId: null // per compatibilità
  }));

  // Notifiche: like e comment dal modello Notification
  const otherNotifications = await prisma.notification.findMany({
    where: { userId, NOT: { type: 'follow-request' as any } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { fromUser: { select: { id: true, name: true, username: true, image: true } } }
  });

  // Unifica e ordina tutte le notifiche
  // Uniforma anche le notifiche like/comment per compatibilità
  const normalizedOther = otherNotifications.map(n => ({
    id: n.id,
    type: n.type,
    message: n.message,
    createdAt: n.createdAt,
    fromUserId: n.fromUserId,
    postId: n.postId || null,
    requester: n.fromUser || null
  }));
  const allNotifications = [
    ...followNotifications,
    ...normalizedOther
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return Response.json(allNotifications);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const userId = (session.user as any).id as string;
  const body = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body?.ids)
    ? body.ids
    : (body?.id ? [body.id] : []);
  if (!ids.length) return Response.json({ error: 'Nessun id fornito' }, { status: 400 });
  const result = await prisma.notification.deleteMany({ where: { userId, id: { in: ids } } });
  return Response.json({ success: true, deleted: result.count });
}

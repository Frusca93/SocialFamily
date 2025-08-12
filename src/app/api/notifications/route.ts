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
  // Mappa in formato notifica compatibile con la UI
  const notifications = requests.map(r => ({
    id: r.id,
    type: 'follow-request',
    fromUserId: r.requesterId,
    message: `${r.requester.name || 'Qualcuno'} ti ha inviato una richiesta di follow`,
    requester: r.requester,
    createdAt: r.createdAt
  }));
  return Response.json(notifications);
}

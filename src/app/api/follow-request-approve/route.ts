import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { requesterId } = await req.json();
  const targetId = (session.user as any).id;
  // Trova richiesta pending
  const request = await prisma.followRequest.findUnique({
    where: { requesterId_targetId: { requesterId, targetId } }
  });
  if (!request || request.status !== 'pending') return Response.json({ error: 'Richiesta non trovata' }, { status: 404 });
  // Approva richiesta
  await prisma.followRequest.update({
    where: { requesterId_targetId: { requesterId, targetId } },
    data: { status: 'approved' }
  });
  // Crea relazione follow
  await prisma.follow.create({ data: { followerId: requesterId, followingId: targetId } });
  // Elimina la richiesta di follow (così sparisce dalle notifiche)
  await prisma.followRequest.delete({ where: { requesterId_targetId: { requesterId, targetId } } });
  // Rimuovi eventuali notifiche duplicate di tipo follow-request
  await prisma.notification.deleteMany({ where: { userId: targetId, fromUserId: requesterId, type: 'follow-request' as any } });
  return Response.json({ success: true });
}

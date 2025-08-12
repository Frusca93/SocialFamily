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
  // Rifiuta richiesta
  await prisma.followRequest.update({
    where: { requesterId_targetId: { requesterId, targetId } },
    data: { status: 'declined' }
  });
  // Elimina la richiesta di follow (così sparisce dalle notifiche)
  await prisma.followRequest.delete({ where: { requesterId_targetId: { requesterId, targetId } } });
  return Response.json({ success: true });
}

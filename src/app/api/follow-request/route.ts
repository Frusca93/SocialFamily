import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { targetUserId } = await req.json();
  const requesterId = (session.user as any).id;
  if (targetUserId === requesterId) return Response.json({ error: 'Non puoi seguirti' }, { status: 400 });
  // Se già esiste follow approvato, errore
  const alreadyFollowing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: requesterId, followingId: targetUserId } }
  });
  if (alreadyFollowing) return Response.json({ error: 'Sei già un follower' }, { status: 400 });
  // Se già esiste richiesta pending, errore
  const existingRequest = await prisma.followRequest.findUnique({
    where: { requesterId_targetId: { requesterId, targetId: targetUserId } }
  });
  if (existingRequest && existingRequest.status === 'pending') return Response.json({ error: 'Richiesta già inviata' }, { status: 400 });
  // Crea richiesta
  const reqFollow = await prisma.followRequest.upsert({
    where: { requesterId_targetId: { requesterId, targetId: targetUserId } },
    update: { status: 'pending' },
    create: { requesterId, targetId: targetUserId, status: 'pending' }
  });
  return Response.json({ success: true, request: reqFollow });
}

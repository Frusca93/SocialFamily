import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { userId, followerId } = await req.json();
  // Solo il proprietario può rimuovere follower
  if ((session.user as any).id !== userId) return Response.json({ error: 'Forbidden' }, { status: 403 });
  console.log('remove-follower', { userId, followerId });
  const result = await prisma.follow.deleteMany({ where: { followerId, followingId: userId } });
  console.log('deleteMany result', result);
  // Pulisci eventuali FollowRequest esistenti tra le parti (qualsiasi stato)
  await prisma.followRequest.deleteMany({ where: { requesterId: followerId, targetId: userId } });
  // Rimuovi eventuali notifiche di tipo follow-request verso il proprietario dal follower rimosso
  await prisma.notification.deleteMany({ where: { userId, fromUserId: followerId, type: 'follow-request' as any } });
  return Response.json({ success: true, deleted: result.count });
}

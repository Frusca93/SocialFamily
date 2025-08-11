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
  return Response.json({ success: true, deleted: result.count });
}

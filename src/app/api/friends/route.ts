import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json([], { status: 401 });
  const userId = (session.user as any).id as string;
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim().toLowerCase();

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: { following: { select: { id: true, name: true, username: true, image: true } } },
    take: 200
  });
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    include: { follower: { select: { id: true, name: true, username: true, image: true } } },
    take: 200
  });

  const map = new Map<string, any>();
  for (const f of following) map.set(f.following.id, f.following);
  for (const f of followers) map.set(f.follower.id, f.follower);
  let users = Array.from(map.values());
  if (q) {
    users = users.filter(u =>
      (u.username && u.username.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q))
    );
  }
  users.sort((a, b) => (a.name || a.username).localeCompare(b.name || b.username));
  return Response.json(users.slice(0, 20));
}

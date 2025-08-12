

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import FeedPageClient from './FeedPageClient'


export default async function FeedPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }
  const userId = (session.user as any).id;
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  });
  const followingIds = following.map(f => f.followingId);
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { authorId: userId },
        { authorId: { in: followingIds.length > 0 ? followingIds : [''] } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      _count: true,
      likes: { where: { userId } },
    },
  });
  const postsWithLiked = posts.map(p => ({
    ...p,
    liked: p.likes && p.likes.length > 0,
  }));
  return <FeedPageClient posts={postsWithLiked} />;
}

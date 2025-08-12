
import NewPost from '@/components/NewPost'
import PostCard from '@/components/PostCard'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

import FeedClient from './FeedClient'

export default async function FeedPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }
  const userId = (session.user as any).id;
  // Trova gli ID degli utenti seguiti
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  });
  const followingIds = following.map(f => f.followingId);
  // Mostra solo i post dell'utente loggato o di chi segue
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { authorId: userId },
        { authorId: { in: followingIds.length > 0 ? followingIds : [''] } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: { author: true, _count: true }
  });
  return <FeedClient posts={posts} />
  return <FeedClient posts={posts} />
}



import NewPost from '@/components/NewPost'
import PostCard from '@/components/PostCard'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { useRef } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import { Suspense } from 'react'
const FeedClient = dynamic(() => import('./FeedClient'), { ssr: false })


// Wrapper client component to handle refs and pass scrollToPost to Navbar
import React from 'react';

async function getFeedData() {
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
  return postsWithLiked;
}

export default async function FeedPage() {
  const postsWithLiked = await getFeedData();
  // Render a client wrapper to handle refs
  return <FeedPageClient posts={postsWithLiked} />;
}

// Client component
function FeedPageClient({ posts }: { posts: any[] }) {
  const feedRef = useRef<any>(null);
  // Funzione di scroll da passare a Navbar
  const handleScrollToPost = (postId: string) => {
    if (feedRef.current && typeof feedRef.current.scrollToPost === 'function') {
      feedRef.current.scrollToPost(postId);
    }
  };
  return (
    <>
      <Navbar onScrollToPost={handleScrollToPost} />
      <FeedClient ref={feedRef} posts={posts} />
    </>
  );
}

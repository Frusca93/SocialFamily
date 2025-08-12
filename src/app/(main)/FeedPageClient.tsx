"use client";
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

const FeedClient = dynamic(() => import('./FeedClient'), { ssr: false });

export default function FeedPageClient({ posts }: { posts: any[] }) {
  const feedRef = useRef<any>(null);
  // Funzione di scroll da passare a Navbar e FeedClient
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

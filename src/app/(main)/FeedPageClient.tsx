"use client";
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

const FeedClient = dynamic(() => import('./FeedClient'), { ssr: false });

export default function FeedPageClient({ posts }: { posts: any[] }) {
  const feedRef = useRef<any>(null);
  const searchParams = useSearchParams();
  // Funzione di scroll da passare a Navbar e FeedClient
  const handleScrollToPost = (postId: string) => {
    if (feedRef.current && typeof feedRef.current.scrollToPost === 'function') {
      feedRef.current.scrollToPost(postId);
    }
  };
  // Auto-scroll when ?post=ID is present or changes
  const postParam = searchParams?.get('post') ?? null;
  useEffect(() => {
    if (postParam) {
      setTimeout(() => handleScrollToPost(postParam), 150);
    }
  }, [postParam]);
  return (
    <>
      <FeedClient ref={feedRef} posts={posts} />
    </>
  );
}

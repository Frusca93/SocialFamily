"use client";
import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { ScrollToPostContext } from './ScrollToPostContext';

const FeedClient = dynamic(() => import('./FeedClient'), { ssr: false });

export default function FeedPageClient({ posts }: { posts: any[] }) {
  const feedRef = useRef<any>(null);
  // Funzione di scroll da passare tramite context
  const handleScrollToPost = (postId: string) => {
    if (feedRef.current && typeof feedRef.current.scrollToPost === 'function') {
      feedRef.current.scrollToPost(postId);
    }
  };
  return (
    <ScrollToPostContext.Provider value={handleScrollToPost}>
      <FeedClient ref={feedRef} posts={posts} />
    </ScrollToPostContext.Provider>
  );
}

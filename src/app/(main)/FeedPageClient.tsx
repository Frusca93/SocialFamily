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
    } else {
      // fallback diretto
      const el = document.getElementById(`post-${postId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  // Auto-scroll when ?post=ID is present or changes
  const postParam = searchParams?.get('post') ?? null;
  useEffect(() => {
    if (postParam) {
      // prova più volte: la lista può impiegare un attimo a renderizzare
      let attempts = 0;
      const max = 12; // ~2s
      const tick = () => {
        attempts++;
        handleScrollToPost(postParam);
        if (attempts < max) setTimeout(tick, 150);
      };
      setTimeout(tick, 100);
    }
  }, [postParam]);

  // Listen to custom event dispatched by Navbar when already on '/'
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { postId?: string } | undefined;
      if (detail?.postId) handleScrollToPost(detail.postId);
    };
    window.addEventListener('scroll-to-post', handler as EventListener);
    return () => window.removeEventListener('scroll-to-post', handler as EventListener);
  }, []);
  return (
    <>
      <FeedClient ref={feedRef} posts={posts} />
    </>
  );
}

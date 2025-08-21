"use client";
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const FeedClient = dynamic(() => import('./FeedClient'), { ssr: false });

export default function FeedPageClient({ posts }: { posts: any[] }) {
  const feedRef = useRef<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const safePathname = pathname ?? '/';
  const searchParams = useSearchParams();
  // Funzione di scroll da passare a Navbar e FeedClient
  const handleScrollToPost = (postId: string) => {
    if (feedRef.current && typeof feedRef.current.scrollToPost === 'function') {
      feedRef.current.scrollToPost(postId);
    } else {
      // fallback diretto
    const el = document.getElementById(`post-${postId}`);
    if (el) el.scrollIntoView({ block: 'center' });
    }
  };
  // Auto-scroll when ?post=ID is present or changes (no animation)
  const postParam = searchParams?.get('post') ?? null;
  useEffect(() => {
    if (postParam) {
    // attendi il render e salta direttamente senza animazione
    const id = setTimeout(() => handleScrollToPost(postParam), 50);
    return () => clearTimeout(id);
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

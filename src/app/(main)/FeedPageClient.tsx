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
      // rimuovi il param una volta completato lo scroll o dopo un piccolo delay
      const cleanTimeout = setTimeout(() => {
        try {
          const params = new URLSearchParams(Array.from(searchParams?.entries?.() ?? []));
          params.delete('post');
          const qs = params.toString();
          router.replace(qs ? `${safePathname}?${qs}` : safePathname, { scroll: false });
        } catch {}
      }, 1800);
      // se l'utente scorre manualmente, rimuovi subito
      const startY = window.scrollY;
      const onScroll = () => {
        if (Math.abs(window.scrollY - startY) > 10) {
          try {
            const params = new URLSearchParams(Array.from(searchParams?.entries?.() ?? []));
            params.delete('post');
            const qs = params.toString();
            router.replace(qs ? `${safePathname}?${qs}` : safePathname, { scroll: false });
          } catch {}
          window.removeEventListener('scroll', onScroll);
          clearTimeout(cleanTimeout);
        }
      };
      window.addEventListener('scroll', onScroll, { once: false, passive: true });
      return () => { window.removeEventListener('scroll', onScroll); clearTimeout(cleanTimeout); };
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

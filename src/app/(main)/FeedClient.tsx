"use client";
import NewPost from '@/components/NewPost';
import PostCard from '@/components/PostCard';
import { LanguageContext } from '@/app/LanguageContext';
import { useContext, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

const translations = {
  it: { noPosts: 'Nessun post trovato', explore: 'Esplora' },
  en: { noPosts: 'No posts found', explore: 'Explore' },
  fr: { noPosts: 'Aucun post trouvé', explore: 'Explorer' },
  es: { noPosts: 'Ningún post encontrado', explore: 'Explorar' },
};

const FeedClient = forwardRef(function FeedClient({ posts }: { posts: any[] }, ref) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  const [feedPosts, setFeedPosts] = useState(posts);
  // ...nessuna logica socket...

  useImperativeHandle(ref, () => ({
    scrollToPost: (postId: string) => {
      let attempts = 0;
      const maxAttempts = 10;
      const delay = 100;
      function tryScroll() {
        const el = document.getElementById(`post-${postId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, delay);
        }
      }
      tryScroll();
    }
  }), [feedPosts]);

  // Auto-refresh every 30s without losing scroll position
  useEffect(() => {
  const load = async () => {
      try {
        const res = await fetch('/api/posts', { cache: 'no-store' });
        if (!res.ok) return;
        const fresh = await res.json();
        // Preserve liked flag if present locally
        const mapLiked = new Map(feedPosts.map(p => [p.id, p.liked]));
  const merged = fresh.map((p: any) => ({ ...p, liked: mapLiked.get(p.id) ?? p.liked }));
        setFeedPosts(merged);
      } catch {}
    };
  const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [feedPosts]);
  return (
    <div className="space-y-0 sm:space-y-6">
      <div className="flex justify-center sm:justify-start">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          {t.explore}
        </h1>
      </div>
      <div className="hidden sm:block">
        <NewPost />
      </div>
      <div className="mt-2 sm:mt-0 space-y-4">
        {feedPosts.length === 0 ? (
          <div className="text-center text-gray-500">{t.noPosts}</div>
        ) : (
          feedPosts.map(p => (
            <PostCard key={p.id} post={p as any} />
          ))
        )}
      </div>
    </div>
  );
});
export default FeedClient;

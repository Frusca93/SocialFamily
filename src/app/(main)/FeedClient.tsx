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
  // Mobile search state
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any | null>(null);
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
  // Preserva SOLO il flag liked locale, ma usa i contatori aggiornati dal server
  const mapLiked = new Map(feedPosts.map(p => [p.id, p.liked]));
  const merged = fresh.map((p: any) => ({ ...p, liked: mapLiked.get(p.id) ?? p.liked }));
  setFeedPosts(merged);
      } catch {}
    };
  const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [feedPosts]);

  // Debounced search when typing
  useEffect(() => {
    const term = q.trim();
    if (!term) { setResults(null); return; }
    const ctrl = new AbortController();
    const id = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        const j = await r.json().catch(() => null);
        if (j) setResults(j);
      } catch {}
    }, 300);
    return () => { ctrl.abort(); clearTimeout(id); };
  }, [q]);

  return (
    <div className="space-y-0 sm:space-y-6">
  <div className="flex justify-center sm:justify-start pt-2 pb-4 sm:pt-3 sm:pb-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          {t.explore}
        </h1>
      </div>
      {/* Mobile search under title */}
      <div className="sm:hidden px-2 -mt-2 mb-3">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
            {/* magnifier icon path */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="11" cy="11" r="7"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder={t.explore}
            className="w-full rounded-full border bg-white pl-9 pr-3 py-2 text-[16px] shadow"
          />
        </div>
        {q.trim().length > 0 && results && (
          <div className="mt-2 rounded-xl border bg-white p-2">
            {Array.isArray(results.users) && Array.isArray(results.posts) ? (
              (results.users.length > 0 || results.posts.length > 0) ? (
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <h4 className="mb-1 font-semibold">Utenti</h4>
                    <ul className="space-y-1">
                      {results.users.map((u: any) => (
                        <li key={u.id} className="truncate">@{u.username}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">Post</h4>
                    <ul className="space-y-1">
                      {results.posts.map((p: any) => (
                        <li key={p.id} className="truncate">{p.content}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">Nessun risultato</div>
              )
            ) : (
              <div className="text-center text-red-500">Errore ricerca</div>
            )}
          </div>
        )}
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

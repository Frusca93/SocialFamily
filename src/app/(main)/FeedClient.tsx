"use client";
import Link from 'next/link';
import NewPost from '@/components/NewPost';
import PostCard from '@/components/PostCard';
import { LanguageContext } from '@/app/LanguageContext';
import { useContext, useEffect, useState, useImperativeHandle, forwardRef, useRef } from 'react';

const translations = {
  it: { noPosts: 'Nessun post trovato', explore: 'Esplora', searchPlaceholder: 'trova i tuoi amici', users: 'Utenti', posts: 'Post', noResults: 'Nessun risultato', searchError: 'Errore ricerca' },
  en: { noPosts: 'No posts found', explore: 'Explore', searchPlaceholder: 'find your friends', users: 'Users', posts: 'Posts', noResults: 'No results', searchError: 'Search error' },
  fr: { noPosts: 'Aucun post trouvé', explore: 'Explorer', searchPlaceholder: 'trouve tes amis', users: 'Utilisateurs', posts: 'Posts', noResults: 'Aucun résultat', searchError: 'Erreur de recherche' },
  es: { noPosts: 'Ningún post encontrado', explore: 'Explorar', searchPlaceholder: 'encuentra a tus amigos', users: 'Usuarios', posts: 'Publicaciones', noResults: 'Sin resultados', searchError: 'Error de búsqueda' },
};

const FeedClient = forwardRef(function FeedClient({ posts }: { posts: any[] }, ref) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  const [feedPosts, setFeedPosts] = useState(posts);
  // Mobile search state
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any | null>(null);
  // Fixed-on-scroll behavior
  const [headerH, setHeaderH] = useState<number>(56);
  const [affix, setAffix] = useState(false);
  const [searchH, setSearchH] = useState<number>(48);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const anchorTopRef = useRef<number>(0);
  useEffect(() => {
    const header = document.querySelector('header') as HTMLElement | null;
    const compute = () => {
      const h = header?.getBoundingClientRect().height || 56;
      setHeaderH(h);
      if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        anchorTopRef.current = rect.top + window.scrollY; // absolute Y
        // measure input box height
        const box = anchorRef.current.querySelector('[data-role="search-box"]') as HTMLElement | null;
        const hh = box?.getBoundingClientRect().height || 48;
        setSearchH(hh);
      }
    };
    compute();
    const onResize = () => compute();
    window.addEventListener('resize', onResize);
    // observe size changes of the search box
    const ro = new ResizeObserver(() => compute());
    if (anchorRef.current) {
      const box = anchorRef.current.querySelector('[data-role="search-box"]') as HTMLElement | null;
      if (box) ro.observe(box);
    }
    // scroll listener to toggle affix
    const onScroll = () => {
      const triggerY = anchorTopRef.current - (header?.getBoundingClientRect().height || 56);
      setAffix(window.scrollY >= triggerY - 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll); ro.disconnect(); };
  }, []);
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
        <h1 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
          {t.explore}
        </h1>
      </div>
      {/* Mobile search under title (fixed when scrolled under header) */}
      <div className="sm:hidden px-2 -mt-2 mb-0" ref={anchorRef}>
        {/* Placeholder takes height when affixed to avoid layout shift */}
        <div style={{ height: affix ? searchH + 10 : 0 }} />
        {/* In-flow box (shown when not affixed) */}
        {!affix && (
          <div className="mx-auto w-full max-w-screen-sm">
          <div className="relative pb-[10px]" data-role="search-box">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {/* magnifier icon path */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              ref={inputRef}
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full rounded-full border bg-white pl-9 pr-10 py-2 text-[16px] shadow"
            />
            {q && (
              <button
                aria-label="Pulisci"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-600 hover:bg-gray-100"
                onClick={() => { setQ(''); inputRef.current?.focus(); }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          </div>
        )}
        {/* Fixed box (shown when affixed) */}
        {affix && (
          <div className="fixed left-0 right-0 z-[9] bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/70" style={{ top: headerH }}>
            <div className="mx-auto w-full max-w-screen-sm px-2">
              <div className="relative pb-[10px]" data-role="search-box">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <circle cx="11" cy="11" r="7"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                </span>
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-full border bg-white pl-9 pr-10 py-2 text-[16px] shadow"
                />
                {q && (
                  <button
                    aria-label="Pulisci"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-600 hover:bg-gray-100"
                    onClick={() => { setQ(''); inputRef.current?.focus(); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {q.trim().length > 0 && results && (
          <div className="mt-2 rounded-xl border bg-white p-2">
            {Array.isArray(results.users) && Array.isArray(results.posts) ? (
              (results.users.length > 0 || results.posts.length > 0) ? (
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <h4 className="mb-1 font-semibold">{t.users}</h4>
                    <ul className="space-y-1">
                      {results.users.map((u: any) => (
                        <li key={u.id}>
                          <Link href={`/profile/${u.username}`} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-50">
                            {u.image ? (
                              <img src={u.image} alt={u.name || u.username} className="h-8 w-8 rounded-full object-cover" />
                            ) : (
                              <div className="h-8 w-8 rounded-full bg-gray-200" />
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-medium truncate">{u.name || u.username}</div>
                              <div className="text-xs text-gray-500 truncate">@{u.username}</div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">{t.posts}</h4>
                    <ul className="space-y-1">
                      {results.posts.map((p: any) => (
                        <li key={p.id} className="truncate">{p.content}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">{t.noResults}</div>
              )
            ) : (
              <div className="text-center text-red-500">{t.searchError}</div>
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

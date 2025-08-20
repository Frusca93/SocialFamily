'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef as useDomRef } from 'react';
import { useScrollToPost } from '@/app/(main)/ScrollToPostContext';
import Logo from './Logo'
import { useState, useContext, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { LanguageContext } from '@/app/LanguageContext'
import { BsBellFill, BsPersonCircle, BsBoxArrowRight, BsSearch, BsX, BsHouseDoor, BsChatDots, BsPlusLg } from 'react-icons/bs'
import { FaSearch } from 'react-icons/fa'
import NewPost from './NewPost'

const translations = {
  it: {
  search: 'Cerca persone',
    searchBtn: 'Cerca',
    profile: 'Profilo',
    logout: 'Logout',
    users: 'Utenti',
    posts: 'Post',
    noResults: 'Nessun risultato',
    error: 'Errore nella ricerca',
  },
  en: {
  search: 'Search people',
    searchBtn: 'Search',
    profile: 'Profile',
    logout: 'Logout',
    users: 'Users',
    posts: 'Posts',
    noResults: 'No results',
    error: 'Search error',
  },
  fr: {
  search: 'Rechercher des personnes',
    searchBtn: 'Rechercher',
    profile: 'Profil',
    logout: 'Déconnexion',
    users: 'Utilisateurs',
    posts: 'Posts',
    noResults: 'Aucun résultat',
    error: 'Erreur de recherche',
  },
  es: {
  search: 'Buscar personas',
    searchBtn: 'Buscar',
    profile: 'Perfil',
    logout: 'Cerrar sesión',
    users: 'Usuarios',
    posts: 'Publicaciones',
    noResults: 'Sin resultados',
    error: 'Error de búsqueda',
  },
}

type UserWithUsername = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  username?: string;
};

type NavbarProps = {
  onScrollToPost?: (postId: string) => void;
};

export default function Navbar({ onScrollToPost }: NavbarProps) {
  const router = useRouter();
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any | null>(null)
  const { data: session } = useSession()
  const user = session?.user as UserWithUsername | undefined
  const { lang } = useContext(LanguageContext)
  const t = translations[lang as keyof typeof translations] || translations.it

  // Notifiche richieste follow
  // const feedRef = useDomRef<any>(null);
  const [noti, setNoti] = useState<any[]>([])
  const [showNoti, setShowNoti] = useState(false)
  const notiRefMobile = useRef<HTMLDivElement>(null)
  const notiRefDesktop = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!user?.id) return;
  fetch('/api/notifications', { cache: 'no-store' }).then(r=>r.json()).then(setNoti)
  }, [user?.id])

  // Auto-refresh notifications every 3s
  useEffect(() => {
    if (!user?.id) return;
    const id = setInterval(() => {
      fetch('/api/notifications', { cache: 'no-store' }).then(r=>r.json()).then(setNoti).catch(()=>{})
    }, 3000);
    return () => clearInterval(id);
  }, [user?.id])

  // Composer modal (mobile + button)
  const [showComposer, setShowComposer] = useState(false)
  // Mobile search overlay
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchAnimIn, setSearchAnimIn] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => setSearchAnimIn(true));
      setTimeout(() => searchInputRef.current?.focus(), 120);
    } else {
      setSearchAnimIn(false);
    }
  }, [searchOpen])
  // Chiudi dropdown se clic fuori (robusto su mobile): usa pointerdown + composedPath
  useEffect(() => {
    const handle = (e: PointerEvent) => {
      const path = (e.composedPath && e.composedPath()) || [];
      const isInside = path.includes(notiRefMobile.current as any) || path.includes(notiRefDesktop.current as any);
      if (!isInside) setShowNoti(false);
    };
    if (showNoti) document.addEventListener('pointerdown', handle);
    return () => document.removeEventListener('pointerdown', handle);
  }, [showNoti])

  const [loadingReq, setLoadingReq] = useState<string | null>(null);
  const [errorReq, setErrorReq] = useState<string | null>(null);
  async function reloadNotifications() {
    if (!user?.id) return;
    const res = await fetch('/api/notifications');
    setNoti(await res.json());
  }
  async function dismissNotification(id: string) {
    // ottimista: rimuovi subito
    setNoti(prev => prev.filter(n => n.id !== id));
    // backend cleanup (best-effort)
    fetch('/api/notifications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).catch(() => {});
  }
  async function handleApprove(requesterId: string) {
    setLoadingReq(requesterId);
    setErrorReq(null);
    try {
      console.log('[DEBUG] handleApprove requesterId:', requesterId);
      const res = await fetch('/api/follow-request-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId })
      });
      console.log('[DEBUG] handleApprove response status:', res.status);
      let data = {};
      try { data = await res.json(); } catch {}
      console.log('[DEBUG] handleApprove response data:', data);
      if (!res.ok) {
        setErrorReq((data as any).error || 'Errore');
        return;
      }
  // elimina la notifica di follow-request relativa
  setTimeout(() => reloadNotifications(), 0);
    } catch (e) {
      setErrorReq('Errore di rete');
      console.error('[DEBUG] handleApprove exception:', e);
    } finally {
      setLoadingReq(null);
    }
  }
  async function handleDecline(requesterId: string) {
    setLoadingReq(requesterId);
    setErrorReq(null);
    try {
      const res = await fetch('/api/follow-request-decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requesterId })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorReq(data.error || 'Errore');
        return;
      }
  setTimeout(() => reloadNotifications(), 0);
    } catch (e) {
      setErrorReq('Errore di rete');
    } finally {
      setLoadingReq(null);
    }
  }

  async function onSearch(e: React.FormEvent){
    e.preventDefault()
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    setResults(await res.json())
  }

  // Live search while typing with debounce; hide results when input is empty
  useEffect(() => {
    const term = q.trim()
    if (!term) {
      setResults(null)
      return
    }
    const ctrl = new AbortController()
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}` , { signal: ctrl.signal })
        const json = await res.json().catch(() => null)
        if (json) setResults(json)
      } catch {}
    }, 300)
    return () => { ctrl.abort(); clearTimeout(handle) }
  }, [q])

  return (
    <>
  <header className="sticky top-0 z-10 bg-transparent sm:bg-gray-50/80 py-1.5 px-2 sm:px-4 backdrop-blur border-b border-black/5 sm:border-transparent shadow-sm sm:shadow-none">
        <div className="flex items-center gap-2 sm:gap-3 w-full">
          {/* Logo solo desktop */}
          <div className="hidden sm:flex items-center">
            <Logo className="h-12 w-12" />
            <span className="ml-2 text-xl font-bold align-middle" style={{ color: '#1976d2' }}>SocialFamily</span>
          </div>

          {/* Mobile: icone sinistra/destra */}
          <div className="flex items-center justify-between w-full sm:hidden mt-2 mb-2 px-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t.searchBtn}
              className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-400/50 to-purple-400/50 text-black ring-1 ring-black/5 shadow-sm"
              title={t.searchBtn}
            >
              <FaSearch className="w-5 h-5" />
            </button>
            {user?.username && (
              <div className="relative" ref={notiRefMobile}>
                <button onClick={()=>setShowNoti(v=>!v)} className="relative h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-400/50 to-purple-400/50 text-black ring-1 ring-black/5 shadow-sm" title="Notifiche">
                  <BsBellFill className="w-5 h-5" />
                  {noti.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{noti.length}</span>
                  )}
                </button>
                {showNoti && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border bg-white shadow-lg z-50">
                    <div className="p-3 font-semibold border-b flex items-center justify-between">
                      <span>Richieste di follow</span>
                      {noti.length > 0 && (
                        <button
                          className="text-xs text-blue-600 hover:underline"
                          onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); const ids = noti.map(n=>n.id); setNoti([]); fetch('/api/notifications', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }).catch(()=>{}) }}
                        >Segna tutte come lette</button>
                      )}
                    </div>
                    {noti.length === 0 ? (
                      <div className="p-3 text-gray-500 text-sm">Nessuna notifica</div>
                    ) : (
                      <ul className="max-h-80 overflow-y-auto divide-y">
                        {noti.map(n => (
                          <li key={n.id} className="flex items-center gap-2 p-3">
                            {n.type === 'follow-request' && n.fromUserId && (
                              <>
                                {n.requester ? (
                                  <>
                                    {n.requester.image ? (
                                      <img src={n.requester.image} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                                    ) : (
                                      <div className="h-8 w-8 rounded-full bg-gray-200" />
                                    )}
                                    <span className="flex-1">{n.requester.name} <span className="text-gray-500">@{n.requester.username}</span></span>
                                  </>
                                ) : (
                                  <span className="flex-1">{n.message}</span>
                                )}
                                <button
                                  onClick={async (e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await handleApprove(n.fromUserId);
                                    dismissNotification(n.id);
                                  }}
                                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-60"
                                  disabled={loadingReq === n.fromUserId}
                                >{loadingReq === n.fromUserId ? '...' : 'Accetta'}</button>
                                <button
                                  onClick={async (e)=>{
                                    e.preventDefault();
                                    e.stopPropagation();
                                    await handleDecline(n.fromUserId);
                                    dismissNotification(n.id);
                                  }}
                                  className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 disabled:opacity-60"
                                  disabled={loadingReq === n.fromUserId}
                                >{loadingReq === n.fromUserId ? '...' : 'Rifiuta'}</button>
                                {errorReq && (
                                  <div className="text-red-500 text-xs p-2">{errorReq}</div>
                                )}
                              </>
                            )}
                            {n.type === 'like' && n.postId && (
                              <button
                                className="flex-1 text-blue-700 hover:underline text-left"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dismissNotification(n.id);
                                  router.push(`/?post=${n.postId}`);
                                  setTimeout(() => {
                                    window.dispatchEvent(new CustomEvent('scroll-to-post', { detail: { postId: n.postId } }));
                                  }, 50);
                                  setShowNoti(false);
                                }}
                              >{n.message}</button>
                            )}
                            {(n.type === 'comment' || n.type === 'comment-reply') && n.postId && (
                              <button
                                className="flex-1 text-blue-700 hover:underline text-left"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dismissNotification(n.id);
                                  router.push(`/?post=${n.postId}`);
                                  setTimeout(() => {
                                    window.dispatchEvent(new CustomEvent('scroll-to-post', { detail: { postId: n.postId } }));
                                  }, 50);
                                  setShowNoti(false);
                                }}
                              >{n.message}</button>
                            )}
                            {n.type !== 'follow-request' && (
                              <button
                                aria-label="Chiudi notifica"
                                className="ml-2 p-1 rounded hover:bg-gray-100"
                                onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); dismissNotification(n.id) }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop: barra di ricerca classica */}
          <div className="hidden sm:flex items-center gap-2 flex-1">
            <form onSubmit={onSearch} className="flex flex-1 items-center w-full sm:w-auto">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <BsSearch className="w-5 h-5" />
                </span>
                <input
                  value={q}
                  onChange={e=>setQ(e.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-xl border bg-white pl-10 pr-10 py-2 text-sm"
                />
                <button aria-label={t.searchBtn} className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-600 hover:text-black">
                  <BsSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Azioni desktop a destra */}
          <div className="hidden sm:flex items-center gap-2 ml-auto">
          {user?.username && (
            <div className="relative" ref={notiRefDesktop}>
      <button onClick={()=>setShowNoti(v=>!v)} className="relative rounded-full p-2 text-gray-700 hover:bg-gray-200" title="Notifiche">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-300">
                  <BsBellFill className="w-5 h-5" />
                </span>
                {noti.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{noti.length}</span>
                )}
              </button>
              {showNoti && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg z-50">
                  <div className="p-3 font-semibold border-b flex items-center justify-between">
                    <span>Richieste di follow</span>
                    {noti.length > 0 && (
                      <button
                        className="text-xs text-blue-600 hover:underline"
                        onClick={(e)=>{
                          e.preventDefault();
                          e.stopPropagation();
                          const ids = noti.map(n=>n.id);
                          setNoti([]);
                          fetch('/api/notifications', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) }).catch(()=>{})
                        }}
                      >Segna tutte come lette</button>
                    )}
                  </div>
                  {noti.length === 0 ? (
                    <div className="p-3 text-gray-500 text-sm">Nessuna richiesta</div>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto divide-y">
                      {noti.map(n => (
                        <li key={n.id} className="flex items-center gap-2 p-3">
                          {n.type === 'follow-request' && n.requester ? (
                            <>
                              {n.requester.image ? (
                                <img src={n.requester.image} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200" />
                              )}
                              <span className="flex-1">{n.requester.name} <span className="text-gray-500">@{n.requester.username}</span></span>
                              <button onClick={async (e)=>{ e.preventDefault(); e.stopPropagation(); await handleApprove(n.requester.id); dismissNotification(n.id); }} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Accetta</button>
                              <button onClick={async (e)=>{ e.preventDefault(); e.stopPropagation(); await handleDecline(n.requester.id); dismissNotification(n.id); }} className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">Rifiuta</button>
                            </>
                          ) : (
                            <>
                              {/* Per like/comment: solo messaggio/link */}
          {n.type === 'like' && n.postId && (
                                <button
                                  className="flex-1 text-blue-700 hover:underline text-left"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
            dismissNotification(n.id);
                                    router.push(`/?post=${n.postId}`);
                                    setTimeout(() => {
                                      window.dispatchEvent(new CustomEvent('scroll-to-post', { detail: { postId: n.postId } }));
                                    }, 50);
                                    setShowNoti(false);
                                  }}
                                >{n.message}</button>
                              )}
                              {(n.type === 'comment' || n.type === 'comment-reply') && n.postId && (
                                <button
                                  className="flex-1 text-blue-700 hover:underline text-left"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    router.push(`/?post=${n.postId}`);
                                    setTimeout(() => {
                                      window.dispatchEvent(new CustomEvent('scroll-to-post', { detail: { postId: n.postId } }));
                                    }, 50);
                                    setShowNoti(false);
                                  }}
                                >{n.message}</button>
                              )}
                              {/* fallback: solo testo se manca postId */}
                              {(!n.type || (!n.postId && n.type !== 'follow-request')) && (
                                <span className="flex-1">{n.message}</span>
                              )}
                              {n.type !== 'follow-request' && (
                                <button
                                  aria-label="Chiudi notifica"
                                  className="ml-2 p-1 rounded hover:bg-gray-100"
                                  onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); dismissNotification(n.id) }}
                                >
                                  <BsX className="w-4 h-4" />
                                </button>
                              )}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          {user?.username && (
            <Link href={`/profile/${user.username}`} className="rounded-full p-2 border bg-white text-gray-700 hover:bg-gray-100" title={t.profile} aria-label={t.profile}>
              <BsPersonCircle className="w-6 h-6" />
            </Link>
          )}
          </div>
          {/* Logout solo desktop */}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="hidden sm:flex rounded-full border bg-white p-2 text-gray-700 hover:bg-gray-100 mt-2 sm:mt-0"
            title={t.logout}
            aria-label={t.logout}
          >
            <BsBoxArrowRight className="w-6 h-6" />
          </button>
        </div>
  {q.trim().length > 0 && results && (
        <div className="mt-3 rounded-2xl border bg-white p-3">
          {Array.isArray(results.users) && Array.isArray(results.posts) ? (
            (results.users.length > 0 || results.posts.length > 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
            <div className="text-center text-red-500">{t.error}</div>
          )}
        </div>
        )}
      </header>

      {/* Search overlay mobile con animazione leggera */}
      {searchOpen && (
        <div className="sm:hidden fixed top-0 left-0 right-0 z-30" onClick={() => { setSearchAnimIn(false); setTimeout(()=>setSearchOpen(false), 180); }}>
          <div className={`bg-white/95 backdrop-blur shadow-md rounded-b-2xl p-2 pt-3 ${searchAnimIn ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'} transition-all duration-200`} onClick={(e)=>e.stopPropagation()}>
            <form onSubmit={(e)=>{ onSearch(e); setSearchAnimIn(false); setTimeout(()=>setSearchOpen(false), 180); }} className="flex items-center">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-black">
                  <FaSearch className="w-5 h-5" />
                </span>
                <input
                  ref={searchInputRef}
                  value={q}
                  onChange={e=>setQ(e.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-xl border bg-white pl-10 pr-10 py-2 text-sm"
                />
                <button aria-label="Chiudi ricerca" type="button" className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-lg text-gray-600 hover:text-black" onClick={() => { setSearchAnimIn(false); setTimeout(()=>setSearchOpen(false), 180); }}>
                  <BsX className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

  {/* Spazio per la bottom bar su mobile */}
  <div className="sm:hidden h-20" aria-hidden />

      {/* Bottom navigation mobile */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-20">
        <div className="relative mx-auto max-w-screen-sm">
          <div className="h-20 rounded-t-3xl bg-gradient-to-r from-indigo-400 to-purple-400 text-white px-8 flex items-center justify-between shadow-2xl">
            {/* Home */}
            <button
              className="p-2 rounded-full hover:bg-white/10"
              aria-label="Home"
              onClick={() => router.push('/')}
            >
              <BsHouseDoor className="w-6 h-6" />
            </button>

            {/* Profile */}
            <button
              className="p-2 rounded-full hover:bg-white/10"
              aria-label={t.profile}
              onClick={() => user?.username && router.push(`/profile/${user.username}`)}
            >
              <BsPersonCircle className="w-6 h-6" />
            </button>

            {/* Plus floating */}
      <div className="absolute left-1/2 -top-7 -translate-x-1/2">
              <button
                aria-label="Nuovo post"
                onClick={() => setShowComposer(true)}
        className="h-12 w-12 rounded-full bg-white text-blue-700 shadow-xl ring-6 ring-white flex items-center justify-center"
              >
        <BsPlusLg className="w-5 h-5" />
              </button>
            </div>

            {/* Chat placeholder */}
            <button
              className="p-2 rounded-full hover:bg-white/10"
              aria-label="Messaggi"
              onClick={() => { /* placeholder for future chat */ }}
            >
              <BsChatDots className="w-6 h-6" />
            </button>

            {/* Logout */}
            <button
              className="p-2 rounded-full hover:bg-white/10"
              aria-label={t.logout}
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <BsBoxArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Modal composer */}
      {showComposer && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowComposer(false)}>
          <div className="w-full sm:max-w-xl sm:rounded-2xl bg-white p-3 sm:p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-semibold">{t.posts}</h3>
              <button aria-label="Chiudi" className="p-2 rounded hover:bg-gray-100" onClick={()=>setShowComposer(false)}>
                <BsX className="w-6 h-6" />
              </button>
            </div>
            <div className="pt-3">
              <NewPost />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'
import Link from 'next/link'
import Logo from './Logo'
import { useState, useContext, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { LanguageContext } from '@/app/layout'

const translations = {
  it: {
    search: 'Cerca persone o post',
    searchBtn: 'Cerca',
    profile: 'Profilo',
    logout: 'Logout',
    users: 'Utenti',
    posts: 'Post',
    noResults: 'Nessun risultato',
    error: 'Errore nella ricerca',
  },
  en: {
    search: 'Search people or posts',
    searchBtn: 'Search',
    profile: 'Profile',
    logout: 'Logout',
    users: 'Users',
    posts: 'Posts',
    noResults: 'No results',
    error: 'Search error',
  },
  fr: {
    search: 'Rechercher des personnes ou des posts',
    searchBtn: 'Rechercher',
    profile: 'Profil',
    logout: 'Déconnexion',
    users: 'Utilisateurs',
    posts: 'Posts',
    noResults: 'Aucun résultat',
    error: 'Erreur de recherche',
  },
  es: {
    search: 'Buscar personas o publicaciones',
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
  name?: string;
  email?: string;
  image?: string;
  username?: string;
};

export default function Navbar() {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<any | null>(null)
  const { data: session } = useSession()
  const user = session?.user as UserWithUsername | undefined
  const { lang } = useContext(LanguageContext)
  const t = translations[lang as keyof typeof translations] || translations.it

  // Notifiche richieste follow
  const [noti, setNoti] = useState<any[]>([])
  const [showNoti, setShowNoti] = useState(false)
  const notiRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!user?.username) return;
    fetch('/api/notifications').then(r=>r.json()).then(setNoti)
  }, [user?.username])

  // Burger menu mobile
  const [showMenu, setShowMenu] = useState(false)
  // Chiudi dropdown se clic fuori
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(e.target as Node)) setShowNoti(false)
    }
    if (showNoti) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showNoti])

  async function handleApprove(requesterId: string) {
    await fetch('/api/follow-request-approve', { method: 'POST', body: JSON.stringify({ requesterId }) })
    setNoti(noti.filter(n => n.requester.id !== requesterId))
  }
  async function handleDecline(requesterId: string) {
    await fetch('/api/follow-request-decline', { method: 'POST', body: JSON.stringify({ requesterId }) })
    setNoti(noti.filter(n => n.requester.id !== requesterId))
  }

  async function onSearch(e: React.FormEvent){
    e.preventDefault()
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    setResults(await res.json())
  }

  return (
    <header className="sticky top-0 z-10 bg-gray-50/80 py-2 px-2 sm:px-4 backdrop-blur">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center">
            <Logo className="h-16 w-16" />
            <span className="ml-3 text-2xl font-bold hidden sm:inline align-middle" style={{ color: '#1976d2' }}>SocialFamily</span>
          </div>
        <div className="flex items-center gap-2 sm:hidden">
          {/* Notifiche sempre visibili */}
          {user?.username && (
            <div className="relative" ref={notiRef}>
              <button onClick={()=>setShowNoti(v=>!v)} className="relative rounded-full p-2 hover:bg-gray-200" title="Notifiche">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 1-4.488 0A8.967 8.967 0 0 1 3 9.75C3 5.798 6.272 2.25 12 2.25s9 3.548 9 7.5a8.967 8.967 0 0 1-7.143 7.332z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5a3 3 0 0 1-6 0" />
                </svg>
                {noti.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{noti.length}</span>
                )}
              </button>
              {showNoti && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border bg-white shadow-lg z-50">
                  <div className="p-3 font-semibold border-b">Richieste di follow</div>
                  {noti.length === 0 ? (
                    <div className="p-3 text-gray-500 text-sm">Nessuna richiesta</div>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto divide-y">
                      {noti.map(n => (
                        <li key={n.id} className="flex items-center gap-2 p-3">
                          {n.requester.image ? (
                            <img src={n.requester.image} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                          )}
                          <span className="flex-1">{n.requester.name} <span className="text-gray-500">@{n.requester.username}</span></span>
                          <button onClick={()=>handleApprove(n.requester.id)} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Accetta</button>
                          <button onClick={()=>handleDecline(n.requester.id)} className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">Rifiuta</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          {/* Burger menu */}
          <button onClick={()=>setShowMenu(v=>!v)} className="rounded p-2 hover:bg-gray-200" aria-label="Menu">
            {showMenu ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
            )}
          </button>
          {showMenu && (
            <div className="absolute top-14 right-2 w-40 rounded-xl border bg-white shadow-lg z-50 flex flex-col animate-fade-in">
              {/* X in alto a destra, fuori dalle voci */}
              <div className="flex justify-end">
                <button onClick={()=>setShowMenu(false)} className="p-2 text-gray-500 hover:text-black sm:hidden" aria-label="Chiudi menu">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {user?.username && (
                <Link href={`/profile/${user.username}`} className="px-4 py-3 hover:bg-gray-100 border-b" onClick={()=>setShowMenu(false)}>{t.profile}</Link>
              )}
              <button
                onClick={() => { setShowMenu(false); signOut({ callbackUrl: '/login' }) }}
                className="px-4 py-3 hover:bg-gray-100 text-left"
              >{t.logout}</button>
            </div>
          )}
        </div>
        </div>
        <form onSubmit={onSearch} className="flex flex-1 gap-2 w-full sm:w-auto">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search} className="w-full rounded-xl border bg-white px-3 py-2 text-sm" />
          <button className="rounded-xl border bg-white px-4 text-sm">{t.searchBtn}</button>
        </form>
        <div className="hidden sm:flex items-center gap-2 ml-auto">
          {user?.username && (
            <div className="relative" ref={notiRef}>
              <button onClick={()=>setShowNoti(v=>!v)} className="relative rounded-full p-2 hover:bg-gray-200" title="Notifiche">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 1-4.488 0A8.967 8.967 0 0 1 3 9.75C3 5.798 6.272 2.25 12 2.25s9 3.548 9 7.5a8.967 8.967 0 0 1-7.143 7.332z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5a3 3 0 0 1-6 0" />
                </svg>
                {noti.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">{noti.length}</span>
                )}
              </button>
              {showNoti && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border bg-white shadow-lg z-50">
                  <div className="p-3 font-semibold border-b">Richieste di follow</div>
                  {noti.length === 0 ? (
                    <div className="p-3 text-gray-500 text-sm">Nessuna richiesta</div>
                  ) : (
                    <ul className="max-h-80 overflow-y-auto divide-y">
                      {noti.map(n => (
                        <li key={n.id} className="flex items-center gap-2 p-3">
                          {n.requester.image ? (
                            <img src={n.requester.image} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200" />
                          )}
                          <span className="flex-1">{n.requester.name} <span className="text-gray-500">@{n.requester.username}</span></span>
                          <button onClick={()=>handleApprove(n.requester.id)} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">Accetta</button>
                          <button onClick={()=>handleDecline(n.requester.id)} className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200">Rifiuta</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
          {user?.username && (
            <Link href={`/profile/${user.username}`} className="rounded-xl border bg-white px-3 py-2">{t.profile}</Link>
          )}
        </div>
        {/* Logout solo su desktop, su mobile è nel burger menu */}
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="hidden sm:flex rounded-xl border bg-white px-3 py-2 items-center gap-2 mt-2 sm:mt-0"
          title={t.logout}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H9m0 0l3-3m-3 3l3 3" />
          </svg>
          {t.logout}
        </button>
      </div>
      {results && (
        <div className="mt-3 rounded-2xl border bg-white p-3">
          {Array.isArray(results.users) && Array.isArray(results.posts) ? (
            (results.users.length > 0 || results.posts.length > 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <h4 className="mb-1 font-semibold">{t.users}</h4>
                  <ul className="space-y-1">
                    {results.users.map((u: any) => (
                      <li key={u.id}><Link className="text-blue-700" href={`/profile/${u.username}`}>@{u.username}</Link></li>
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
  )
}

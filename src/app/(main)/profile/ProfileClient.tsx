"use client";
import FollowButton from '@/components/FollowButton';
import PostCard from '@/components/PostCard';
import FollowListModal from '@/components/FollowListModal';
import { LanguageContext } from '@/app/LanguageContext';
import { useContext, useEffect, useState } from 'react';

const translations = {
  it: {
    notFound: 'Utente non trovato',
    bioUnset: 'Bio non impostata',
    followers: 'follower',
    following: 'seguiti',
    settings: 'Impostazioni',
  },
  en: {
    notFound: 'User not found',
    bioUnset: 'Bio not set',
    followers: 'followers',
    following: 'following',
    settings: 'Settings',
  },
  fr: {
    notFound: 'Utilisateur non trouvé',
    bioUnset: 'Bio non définie',
    followers: 'abonnés',
    following: 'abonnements',
    settings: 'Paramètres',
  },
  es: {
    notFound: 'Usuario no encontrado',
    bioUnset: 'Bio no establecida',
    followers: 'seguidores',
    following: 'seguidos',
    settings: 'Configuración',
  },
};

export default function ProfileClient({ user, posts, followers, following, isOwner, isFollowing, followersList = [], followingList = [], followRequestStatus }: any) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followersState, setFollowersState] = useState(followersList);
  const [followingState, setFollowingState] = useState(followingList);
  const [postsState, setPostsState] = useState(posts);

  // Auto-refresh every 30s: refresh posts and counts; preserve scroll
  useEffect(() => {
  const load = async () => {
      try {
        // Re-fetch profile posts and lists
        const base = `/api/profile`;
        // We don’t have a dedicated API; fallback: reload just posts via server endpoint if available
        // Minimal approach: refetch the current page data via a lightweight API we have: /api/posts filtered by author
        if (user?.id) {
          const res = await fetch(`/api/posts?authorId=${encodeURIComponent(user.id)}`, { cache: 'no-store' }).catch(() => null);
          if (res && res.ok) {
            const fresh = await res.json();
            setPostsState(fresh);
          }
        }
      } catch {}
    };
  const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, [user?.id]);

  // Rimuovi follower (solo se owner)
  const handleRemoveFollower = async (id: string) => {
    // Chiama API per rimuovere follower
    await fetch(`/api/follow/remove-follower`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, followerId: id })
    });
    setFollowersState(followersState.filter((u: any) => u.id !== id));
  };
  // Rimuovi following (unfollow)
  const handleRemoveFollowing = async (id: string) => {
    await fetch(`/api/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: id })
    });
    setFollowingState(followingState.filter((u: any) => u.id !== id));
  };

  if (!user) return <div className="p-6">{t.notFound}</div>;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border bg-white p-6">
        <div className="flex items-center gap-4">
          {user.image ? (
            <img src={user.image} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-200" />
          )}
          <div>
            <h1 className="text-xl font-semibold">{user.name} <span className="text-gray-500">@{user.username}</span></h1>
            <p className="text-sm text-gray-600">{user.bio || t.bioUnset}</p>
            <p className="mt-2 text-sm text-gray-600">
              <span className="cursor-pointer hover:underline" onClick={() => setShowFollowers(true)}>{followersState.length} {t.followers}</span>
              {' · '}
              <span className="cursor-pointer hover:underline" onClick={() => setShowFollowing(true)}>{followingState.length} {t.following}</span>
            </p>
          </div>
          <div className="ml-auto">
            {isOwner ? (
              <a href="/settings" className="rounded-xl border bg-white px-3 py-2">{t.settings}</a>
            ) : (
              <FollowButton targetUserId={user.id} initialFollowing={isFollowing} initialRequestStatus={followRequestStatus} />
            )}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {isOwner || isFollowing || followRequestStatus === 'approved' ? (
          postsState.map((p: any) => <PostCard key={p.id} post={p as any} />)
        ) : (
          <div className="text-center text-gray-500">I post di questo profilo sono privati.</div>
        )}
      </div>
      <FollowListModal
        open={showFollowers}
        onClose={() => setShowFollowers(false)}
        users={followersState}
        onRemove={isOwner ? handleRemoveFollower : () => {}}
      />
      <FollowListModal
        open={showFollowing}
        onClose={() => setShowFollowing(false)}
        users={followingState}
        onRemove={isOwner ? handleRemoveFollowing : () => {}}
      />
    </div>
  );
}

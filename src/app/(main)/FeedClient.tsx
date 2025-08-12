"use client";
import NewPost from '@/components/NewPost';
import PostCard from '@/components/PostCard';
import { LanguageContext } from '@/app/LanguageContext';
import { useContext, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/lib/useSocket';

const translations = {
  it: { noPosts: 'Nessun post trovato' },
  en: { noPosts: 'No posts found' },
  fr: { noPosts: 'Aucun post trouvé' },
  es: { noPosts: 'Ningún post encontrado' },
};

const FeedClient = forwardRef(function FeedClient({ posts }: { posts: any[] }, ref) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  const [feedPosts, setFeedPosts] = useState(posts);
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || null;
  const socket = useSocket(userId);

  useEffect(() => {
    if (!socket) return;
    const handler = (newPost: any) => {
      // Mostra solo se il post è dell'utente o di chi segue (come in page.tsx)
      // Qui si assume che il backend filtri già, oppure si può mostrare sempre
      setFeedPosts(prev => {
        // Evita duplicati
        if (prev.some(p => p.id === newPost.id)) return prev;
        return [newPost, ...prev];
      });
    };
    socket.on('new-post', handler);
    return () => { socket.off('new-post', handler); };
  }, [socket]);

  useImperativeHandle(ref, () => ({
    scrollToPost: (postId: string) => {
      const el = document.getElementById(`post-${postId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }), [feedPosts]);
  return (
    <div className="space-y-6">
      <NewPost />
      <div className="space-y-4">
        {feedPosts.length === 0 ? (
          <div className="text-center text-gray-500">{t.noPosts}</div>
        ) : (
          feedPosts.map(p => <PostCard key={p.id} post={p as any} />)
        )}
      </div>
    </div>
  );
});
export default FeedClient;

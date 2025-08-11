"use client";
import NewPost from '@/components/NewPost';
import PostCard from '@/components/PostCard';
import { LanguageContext } from '@/app/LanguageContext';
import { useContext } from 'react';

const translations = {
  it: { noPosts: 'Nessun post trovato' },
  en: { noPosts: 'No posts found' },
  fr: { noPosts: 'Aucun post trouvé' },
  es: { noPosts: 'Ningún post encontrado' },
};

export default function FeedClient({ posts }: { posts: any[] }) {
  const { lang } = useContext(LanguageContext);
  const t = translations[lang as keyof typeof translations] || translations.it;
  return (
    <div className="space-y-6">
      <NewPost />
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500">{t.noPosts}</div>
        ) : (
          posts.map(p => <PostCard key={p.id} post={p as any} />)
        )}
      </div>
    </div>
  );
}

"use client";
import NewPost from '@/components/NewPost';
import PostCard from '@/components/PostCard';
import { LanguageContext } from '@/app/LanguageContext';
import { useContext, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

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

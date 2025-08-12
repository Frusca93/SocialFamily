import { ReactNode, useRef } from 'react'
import Navbar from '@/components/Navbar'
import { ScrollToPostContext } from './ScrollToPostContext'
import dynamic from 'next/dynamic'

const FeedClient = dynamic(() => import('./FeedClient'), { ssr: false });

export default function MainLayout({ children }: { children: ReactNode }) {
  const feedRef = useRef<any>(null);
  const handleScrollToPost = (postId: string) => {
    if (feedRef.current && typeof feedRef.current.scrollToPost === 'function') {
      feedRef.current.scrollToPost(postId);
    }
  };
  return (
    <ScrollToPostContext.Provider value={handleScrollToPost}>
      <div className="mx-auto max-w-3xl px-4">
        <Navbar />
        {/* FeedClient invisibile solo per ref, children contiene la pagina vera */}
        <div style={{ display: 'none' }}><FeedClient ref={feedRef} posts={[]} /></div>
        <main className="mt-6 space-y-6">{children}</main>
      </div>
    </ScrollToPostContext.Provider>
  )
}

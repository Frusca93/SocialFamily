import { prisma } from '@/lib/prisma';
import PostCard from '@/components/PostCard';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function PostPage({ params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) notFound();
  const userId = (session.user as any).id;
  const post = await prisma.post.findUnique({
    where: { id: params.postId },
    include: {
      author: true,
      _count: true,
      likes: { where: { userId } },
    },
  });
  if (!post) return notFound();
  const postWithLiked = {
    ...post,
    liked: post.likes && post.likes.length > 0,
  };
  return (
    <div className="max-w-xl mx-auto mt-8">
      <PostCard post={postWithLiked} />
    </div>
  );
}

// src/app/api/posts/[postId]/likes/route.ts
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;
  const likes = await prisma.like.findMany({
    where: { postId },
    include: { user: { select: { id: true, name: true, username: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(likes.map(l => l.user));
}

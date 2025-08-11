import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const post = await prisma.post.findUnique({ where: { id: params.postId } })
  if (!post) return Response.json({ error: 'Post non trovato' }, { status: 404 })
  if ((session.user as any).id !== post.authorId) return Response.json({ error: 'Forbidden' }, { status: 403 })
  await prisma.post.delete({ where: { id: params.postId } })
  return Response.json({ ok: true })
}

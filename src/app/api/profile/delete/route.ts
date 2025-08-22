import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string

  try {
    await prisma.$transaction(async (tx) => {
      // First, collect posts authored by the user
      const posts = await tx.post.findMany({ where: { authorId: userId }, select: { id: true } })
      const postIds = posts.map(p => p.id)

      // Collect comments to delete: authored by the user OR on user's posts
      const commentsOnUserPosts = postIds.length
        ? await tx.comment.findMany({ where: { postId: { in: postIds } }, select: { id: true } })
        : []
      const userComments = await tx.comment.findMany({ where: { authorId: userId }, select: { id: true } })
      const commentIdsSet = new Set<string>([...commentsOnUserPosts.map(c => c.id), ...userComments.map(c => c.id)])
      const commentIds = Array.from(commentIdsSet)

      // Detach replies from parents to avoid FK issues
      if (commentIds.length) {
        await tx.comment.updateMany({ where: { parentId: { in: commentIds } }, data: { parentId: null } })
        // Delete the comments
        await tx.comment.deleteMany({ where: { id: { in: commentIds } } })
      }

      // Notifications involving the user (as recipient or sender) or related to deleted posts
      await tx.notification.deleteMany({ where: { OR: [ { userId }, { fromUserId: userId }, postIds.length ? { postId: { in: postIds } } : undefined as any ] } })

      // Delete follow requests sent or received
      await tx.followRequest.deleteMany({ where: { OR: [{ requesterId: userId }, { targetId: userId }] } })
      // Delete follows (followers/following)
      await tx.follow.deleteMany({ where: { OR: [{ followerId: userId }, { followingId: userId }] } })
      // Delete likes by this user (post likes handled via cascade when deleting posts)
      await tx.commentLike.deleteMany({ where: { userId } })
      await tx.like.deleteMany({ where: { userId } })
      // Delete push subscriptions and tokens
      await tx.pushSubscription.deleteMany({ where: { userId } })
      await tx.token.deleteMany({ where: { userId } })
      // Remove user from conversations
      await tx.conversationParticipant.deleteMany({ where: { userId } })

      // Delete posts by the user (likes, media cascade; comments already removed)
      if (postIds.length) {
        await tx.post.deleteMany({ where: { id: { in: postIds } } })
      }

      // Finally, delete the user
      await tx.user.delete({ where: { id: userId } })
    })

    return Response.json({ ok: true })
  } catch (e: any) {
    return Response.json({ error: 'Delete failed' }, { status: 500 })
  }
}

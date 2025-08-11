
import ProfileClient from '../ProfileClient'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

import AvatarUpload from '@/components/AvatarUpload'
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({ where: { username: params.username } })
  const session = await getServerSession(authOptions);
  const isOwner = user && session?.user && (session.user as any).id === user.id;
  // Stato follow e richiesta follow
  let isFollowing = false;
  let followRequestStatus: 'none' | 'pending' | 'approved' | 'declined' = 'none';
  let posts: any[] = [];
  if (user && session?.user && !isOwner) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: (session.user as any).id,
          followingId: user.id
        }
      }
    });
    isFollowing = !!follow;
    // Stato richiesta follow
    const req = await prisma.followRequest.findUnique({
      where: {
        requesterId_targetId: {
          requesterId: (session.user as any).id,
          targetId: user.id
        }
      }
    });
    if (req) followRequestStatus = req.status as any;
    // Mostra i post solo se follow approvato
    if (isFollowing || followRequestStatus === 'approved') {
      posts = await prisma.post.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' }, include: { author: true, _count: true } });
    }
  } else if (isOwner && user) {
    posts = await prisma.post.findMany({ where: { authorId: user.id }, orderBy: { createdAt: 'desc' }, include: { author: true, _count: true } });
  }
  // Lista followers (utenti che seguono questo user)
  const followersList = user ? await prisma.follow.findMany({
    where: { followingId: user.id },
    include: { follower: { select: { id: true, name: true, username: true, image: true } } }
  }) : [];
  // Lista following (utenti che questo user segue)
  const followingList = user ? await prisma.follow.findMany({
    where: { followerId: user.id },
    include: { following: { select: { id: true, name: true, username: true, image: true } } }
  }) : [];
  // Estrarre solo i dati utente
  const followersUsers = followersList.map(f => f.follower);
  const followingUsers = followingList.map(f => f.following);
  return <ProfileClient user={user} posts={posts} followers={followersUsers.length} following={followingUsers.length} isOwner={isOwner} isFollowing={isFollowing} followersList={followersUsers} followingList={followingUsers} followRequestStatus={followRequestStatus} />;
}

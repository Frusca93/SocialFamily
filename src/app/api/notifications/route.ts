import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json([], { status: 401 });
  const userId = (session.user as any).id;
  // Notifiche: richieste follow in attesa
  const requests = await prisma.followRequest.findMany({
    where: { targetId: userId, status: 'pending' },
    include: { requester: { select: { id: true, name: true, username: true, image: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return Response.json(requests);
}

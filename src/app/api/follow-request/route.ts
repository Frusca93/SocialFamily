
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { followRequestSchema } from '@/lib/validations';
import { sendNotification } from '@/lib/notify';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = followRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 });
  const { targetUserId } = body;

  // Crea la richiesta di follow
  const followRequest = await prisma.followRequest.create({
    data: {
      requesterId: (session.user as any).id,
      targetId: targetUserId,
      status: 'pending',
    }
  });
  // Notifica al target user
  if (targetUserId !== (session.user as any).id) {
    const notification = await prisma.notification.create({
      data: {
        userId: targetUserId,
        type: 'follow-request',
        fromUserId: (session.user as any).id,
        message: `${(session.user as any).name || 'Qualcuno'} ti ha inviato una richiesta di follow`,
      }
    })
  await sendNotification(io, targetUserId, notification)
  }
  return Response.json(followRequest);
}


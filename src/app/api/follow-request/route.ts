import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { followRequestSchema } from '@/lib/validations';

  const session = await getServerSession(authOptions);
  if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const parsed = followRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Dati non validi' }, { status: 400 });
  const { targetUserId } = body;

  // Crea la richiesta di follow
  const followRequest = await prisma.followRequest.create({
    data: {
      fromId: (session.user as any).id,
      toId: targetUserId,
    }
  });
  return Response.json(followRequest);
}

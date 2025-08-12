import { prisma } from '@/lib/prisma';

// Elimina notifiche che puntano a post non esistenti
type Notification = { id: string; postId?: string | null };

export async function cleanOrphanNotifications() {
  // Trova tutte le notifiche con postId
  const notifications: Notification[] = await prisma.notification.findMany({
    where: { postId: { not: null } },
    select: { id: true, postId: true },
  });
  // Trova tutti i postId esistenti
  const posts = await prisma.post.findMany({ select: { id: true } });
  const validPostIds = new Set(posts.map(p => p.id));
  // Filtra notifiche orfane
  const orphanIds = notifications.filter(n => n.postId && !validPostIds.has(n.postId)).map(n => n.id);
  if (orphanIds.length === 0) return 0;
  // Elimina notifiche orfane
  await prisma.notification.deleteMany({ where: { id: { in: orphanIds } } });
  return orphanIds.length;
}

// Esempio di uso (da uno script manuale):
// (async () => { const n = await cleanOrphanNotifications(); console.log('Notifiche orfane eliminate:', n); })();

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ensureWebPushConfigured, sendPush } from '@/lib/webpush';

export async function POST(req: NextRequest) {
  const session = await getSession();
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  ensureWebPushConfigured();
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ ok: false, reason: 'PUSH_NOT_CONFIGURED' });
  }
  const subs = await (prisma as any).pushSubscription.findMany({ where: { userId } });
  if (subs.length === 0) return NextResponse.json({ ok: false, reason: 'NO_SUBS' });
  const payload = { title: 'Test push', body: 'Funziona! Tocca per aprire i messaggi.', url: '/messages', icon: '/Alora.png', badge: '/Alora.png' };
  const results = await Promise.all(subs.map((s: any) => sendPush({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload)));
  return NextResponse.json({ ok: true, results });
}

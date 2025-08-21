import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getSession();
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  // If push not configured yet, no-op to avoid runtime errors during setup
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json({ ok: false, reason: 'PUSH_NOT_CONFIGURED' });
  }
  try {
    const body = await req.json();
    const sub = body?.subscription;
    if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
      return NextResponse.json({ error: 'INVALID_SUBSCRIPTION' }, { status: 400 });
    }
    const endpoint: string = sub.endpoint;
    const p256dh: string = sub.keys.p256dh;
    const auth: string = sub.keys.auth;

    // Upsert by endpoint
    const tx = prisma as any;
    const existing = await tx.pushSubscription.findUnique({ where: { endpoint } }).catch(() => null);
    if (existing) {
      await tx.pushSubscription.update({ where: { endpoint }, data: { userId, p256dh, auth } });
    } else {
      await tx.pushSubscription.create({ data: { userId, endpoint, p256dh, auth } });
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR', detail: String(e?.message || e) });
  }
}

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const pub = process.env.VAPID_PUBLIC_KEY || '';
  return NextResponse.json({ key: pub });
}

import webPush from 'web-push';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@example.com';

let configured = false;
export function ensureWebPushConfigured() {
  if (configured) return;
  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webPush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    configured = true;
  }
}

export async function sendPush(subscription: any, payload: any) {
  ensureWebPushConfigured();
  const body = JSON.stringify(payload || {});
  try {
    await webPush.sendNotification(subscription, body);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}

export function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY;
}

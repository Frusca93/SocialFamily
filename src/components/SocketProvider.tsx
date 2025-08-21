// src/components/SocketProvider.tsx
'use client';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  useEffect(() => {
    // Register SW only on client and when supported
    if (typeof window === 'undefined') return;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (!('serviceWorker' in navigator)) return;
    // Prefer mobile/standalone context for now
    if (!isStandalone) return;
    (async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
        // Attempt push subscription (best effort)
        if (!('Notification' in window)) return;
        if (Notification.permission === 'default') {
          try { await Notification.requestPermission(); } catch {}
        }
        if (Notification.permission !== 'granted') return;
        const reg = await navigator.serviceWorker.ready;
        // Fetch VAPID public key from server
        const r = await fetch('/api/push/vapid-public-key');
        const j = await r.json().catch(() => ({}));
        const publicKey = j.key as string;
        if (!publicKey) return;
        const applicationServerKey = urlBase64ToUint8Array(publicKey);
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey }).catch(() => null);
        if (!sub) return;
        // Send subscription to backend
        await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription: sub }) });
      } catch {}
    })();
  }, []);
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }
  return <>{children}</>;
}

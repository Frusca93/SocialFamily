// src/components/SocketProvider.tsx
'use client';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function SocketProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;
  return <>{children}</>;
}

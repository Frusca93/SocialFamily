import { useEffect, useRef } from 'react';
import { io as clientIo, Socket } from 'socket.io-client';

export function useSocket(userId: string | null) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    if (!socketRef.current) {
      socketRef.current = clientIo({
        path: '/api/socketio',
      });
      socketRef.current.emit('join', userId);
    }
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  return socketRef.current;
}

// src/lib/notify.ts
import type { Server as IOServer } from 'socket.io';

export function sendNotification(io: IOServer | undefined, userId: string, notification: any) {
  if (io) {
    io.to(userId).emit('notification', notification);
  }
}

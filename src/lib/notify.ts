// src/lib/notify.ts

export function sendNotification(io: IOServer | undefined, userId: string, notification: any) {
  if (io) {
    io.to(userId).emit('notification', notification);
  }
}

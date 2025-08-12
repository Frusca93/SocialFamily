import { Server } from 'socket.io';
import { NextApiRequest } from 'next';

let io: Server | undefined = undefined;

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });
    io.on('connection', (socket) => {
      socket.on('join', (userId: string) => {
        if (userId) {
          socket.join(userId);
        }
      });
    });
    res.socket.server.io = io;
  }
  res.end();
}

export { io };

import { Server } from 'socket.io';
import { NextApiRequest } from 'next';

let io: Server | undefined = undefined;

export default function handler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
}

export { io };

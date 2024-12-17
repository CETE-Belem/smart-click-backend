import { Socket } from 'socket.io';
import { WsJWTGuard } from '../common/guards/ws.guard';

export type SocketIOMiddleWare = {
  (client: Socket, next: (err?: Error) => void);
};

export function SocketAuthMiddleware(): SocketIOMiddleWare {
  return (client: Socket, next: (err?: Error) => void) => {
    try {
      const payload = WsJWTGuard.validateToken(client);
      client.handshake.query.userId = payload.userId;
      next();
    } catch (err) {
      next(err);
    }
  };
}

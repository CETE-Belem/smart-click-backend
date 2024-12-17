import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { env } from '../../config/env.config';

@Injectable()
export class WsJWTGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }

    const client: Socket = context.switchToWs().getClient();
    WsJWTGuard.validateToken(client);

    return true;
  }

  static validateToken(client: Socket): {
    userId: string;
    role: string;
    email: string;
    confirmEmail: boolean;
    iat: number;
  } {
    const { authorization } = client.handshake.headers;
    if (!authorization) {
      throw new Error('Unauthorized');
    }
    const token = authorization.split(' ')[1];
    const jwtService = new JwtService({
      publicKey: env.JWT_PUBLIC_KEY,
    });
    const payload = jwtService.verify(token);

    return payload;
  }
}

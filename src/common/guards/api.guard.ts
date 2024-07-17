import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class APIGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKeyFromHeader(request);

    if (!apiKey) throw new UnauthorizedException('Chave API é requerida');
    if (apiKey !== process.env.API_KEY)
      throw new UnauthorizedException('Chave da API inválida');

    return true;
  }

  private extractApiKeyFromHeader(request: Request): string | undefined {
    const token = request.headers['apikey'] as string;
    return token;
  }
}

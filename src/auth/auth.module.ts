import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { TurnstileService } from 'src/services/turnstile/turnstile.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TurnstileService, JwtService],
  imports: [
    JwtModule.register({
      global: true,
      publicKey: process.env.JWT_PUBLIC_KEY,
      privateKey: process.env.JWT_PRIVATE_KEY,
      signOptions: {
        // 15 days
        expiresIn: 60 * 60 * 24 * 15,
        algorithm: 'RS256',
      },
    }),
  ],
})
export class AuthModule {}

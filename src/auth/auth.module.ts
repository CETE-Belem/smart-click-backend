import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TurnstileService } from '../services/turnstile/turnstile.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    TurnstileService,
    JwtService,
    UsersService,
    MailService,
  ],
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
    forwardRef(() => UsersModule),
  ],
  exports: [AuthService],
})
export class AuthModule {}

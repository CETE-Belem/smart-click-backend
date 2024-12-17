import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { TurnstileService } from '../services/turnstile/turnstile.service';
import { MailService } from '../mail/mail.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    TurnstileService,
    JwtService,
    MailService,
    AuthService,
  ],
  exports: [UsersService],
  imports: [forwardRef(() => AuthModule), PrismaModule],
})
export class UsersModule {}

import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { TurnstileService } from 'src/services/turnstile/turnstile.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

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

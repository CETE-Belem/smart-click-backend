import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EquipmentsModule } from './equipments/equipments.module';
import { MailModule } from './mail/mail.module';
import { ConcessionaireModule } from './concessionaire/concessionaire.module';
import { ConsumerUnitModule } from './consumer-unit/consumer-unit.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ConflictInterceptor } from './common/interceptors/conflict.interceptor';
import { DatabaseInterceptor } from './common/interceptors/database.interceptor';
import { MqttModule } from './services/mqtt/mqtt.module';
import { WebSocketsModule } from './gateways/websocket.module';
import { SensorDataModule } from './sensor-data/sensor-data.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
    PrismaModule,
    MqttModule,
    WebSocketsModule,
    UsersModule,
    AuthModule,
    EquipmentsModule,
    MailModule,
    ConcessionaireModule,
    ConsumerUnitModule,
    SensorDataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ConflictInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DatabaseInterceptor,
    },
  ],
})
export class AppModule {}

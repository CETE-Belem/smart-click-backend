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
import { ConcessionaireModule } from './concessionaires/concessionaires.module';
import { ConsumerUnitModule } from './consumer-units/consumer-units.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { RatesModule } from './rates/rates.module';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { ConflictInterceptor } from './common/interceptors/conflict.interceptor';
import { DatabaseInterceptor } from './common/interceptors/database.interceptor';
import { MqttModule } from './services/mqtt/mqtt.module';
import { WebSocketsModule } from './gateways/websocket.module';
import { SensorDataModule } from './sensor-datas/sensor-datas.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SensorDataService } from './sensor-datas/sensor-datas.service';
import { MailService } from './mail/mail.service';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ScheduleModule.forRoot(),
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
    RatesModule,
    SensorDataModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SensorDataService,
    MailService,
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

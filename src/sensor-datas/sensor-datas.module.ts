import { Module } from '@nestjs/common';
import { SensorDataService } from './sensor-datas.service';
import { SensorDataController } from './sensor-datas.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [SensorDataController],
  providers: [SensorDataService, PrismaService, MailService],
})
export class SensorDataModule {}

import { Module } from '@nestjs/common';
import { SensorDataService } from './sensor-datas.service';
import { SensorDataController } from './sensor-datas.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SensorDataController],
  providers: [SensorDataService, PrismaService],
})
export class SensorDataModule {}

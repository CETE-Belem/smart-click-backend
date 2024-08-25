import { Module } from '@nestjs/common';
import { SensorDataService } from './sensor-data.service';
import { SensorDataController } from './sensor-data.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SensorDataController],
  providers: [SensorDataService, PrismaService],
})
export class SensorDataModule {}

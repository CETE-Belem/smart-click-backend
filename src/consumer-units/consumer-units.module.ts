import { Module } from '@nestjs/common';
import { ConsumerUnitService } from './consumer-units.service';
import { ConsumerUnitController } from './consumer-units.controller';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [ConsumerUnitController],
  providers: [ConsumerUnitService],
})
export class ConsumerUnitModule {}

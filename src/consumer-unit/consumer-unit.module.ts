import { Module } from '@nestjs/common';
import { ConsumerUnitService } from './consumer-unit.service';
import { ConsumerUnitController } from './consumer-unit.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  //imports: [PrismaModule],
  controllers: [ConsumerUnitController],
  providers: [ConsumerUnitService, PrismaService],
})
export class ConsumerUnitModule {}

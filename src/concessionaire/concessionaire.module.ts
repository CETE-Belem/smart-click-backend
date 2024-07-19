import { Module } from '@nestjs/common';
import { ConcessionaireService } from './concessionaire.service';
import { ConcessionaireController } from './concessionaire.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ConcessionaireController],
  providers: [ConcessionaireService, PrismaService],
})
export class ConcessionaireModule {}

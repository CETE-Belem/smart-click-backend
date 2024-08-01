import { Module } from '@nestjs/common';
import { ConcessionaireService } from './concessionaire.service';
import { ConcessionaireController } from './concessionaire.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConcessionaireController],
  providers: [ConcessionaireService],
})
export class ConcessionaireModule {}

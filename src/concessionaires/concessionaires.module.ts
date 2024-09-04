import { Module } from '@nestjs/common';
import { ConcessionaireService } from './concessionaires.service';
import { ConcessionaireController } from './concessionaires.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ConcessionaireController],
  providers: [ConcessionaireService],
})
export class ConcessionaireModule {}

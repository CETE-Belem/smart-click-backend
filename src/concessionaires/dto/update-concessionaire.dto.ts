import { PartialType } from '@nestjs/swagger';
import { CreateConcessionaireDto } from './create-concessionaire.dto';

export class UpdateConcessionaireDto extends PartialType(
  CreateConcessionaireDto,
) {}

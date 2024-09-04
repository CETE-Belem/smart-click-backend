import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateRateIntervalDto } from './create-rate-interval.dto';

export class UpdateRateIntervalDto extends CreateRateIntervalDto {
  @ApiProperty({ type: String, nullable: false })
  @IsNotEmpty({ message: 'O id do intervalo é obrigatório' })
  @IsString({
    message: 'O id da tarifa deve ser uma string',
  })
  cod_intervalo_tarifa: string;
}

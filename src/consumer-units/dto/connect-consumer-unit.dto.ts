import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ConnectConsumerUnitDto {
  @ApiProperty({
    description: 'Número da unidade consumidora',
    type: String,
    nullable: false,
    example: '12345678',
  })
  @IsString({
    message: 'O número deve ser uma string',
  })
  @Length(8, 8, {
    message: 'O número deve ter 8 caracteres',
  })
  @IsNotEmpty({
    message: 'O número não pode ser vazio',
  })
  @Matches(/^[0-9]+$/, {
    message: 'O número de unidade consumidora deve conter apenas números',
  })
  numero: string;
}

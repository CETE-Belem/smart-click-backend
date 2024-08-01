import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateConsumerUnitDto {
  @ApiProperty({
    description: 'Cidade da unidade consumidora',
    type: String,
    nullable: false,
    example: 'Belém',
  })
  @IsString({
    message: 'A cidade deve ser uma string',
  })
  @MinLength(2, {
    message: 'A cidade deve ter pelo menos 2 caractere',
  })
  @MaxLength(255, {
    message: 'A cidade deve ter no máximo 255 caracteres',
  })
  cidade: string;

  @ApiProperty({
    description: 'Estado da unidade consumidora',
    type: String,
    nullable: false,
    example: 'PA',
  })
  @IsString({
    message: 'O estado deve ser uma string',
  })
  @MinLength(2, {
    message: 'O estado deve ter pelo menos 2 caractere',
  })
  @MaxLength(2, {
    message: 'O estado deve ter no máximo 2 caracteres',
  })
  uf: string;

  @ApiProperty({
    description: 'ID da concessionária da unidade consumidora',
    type: String,
    nullable: false,
    example: '4e2b5b1f-6e4f-4f6f-8f5b-3b4f6e4f5b1f',
  })
  @IsUUID('4', {
    message: 'O ID da concessionária deve ser um UUID v4',
  })
  @IsString({
    message: 'O ID da concessionária deve ser uma string',
  })
  cod_concessionaria: string;
}

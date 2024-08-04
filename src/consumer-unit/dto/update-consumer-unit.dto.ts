import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateConsumerUnitDto {
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

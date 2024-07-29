import { ApiProperty } from '@nestjs/swagger';
import { Fases, Prisma } from '@prisma/client';
import {
  IsMACAddress,
  IsString,
  MaxLength,
  Length,
  MinLength,
  IsDecimal,
} from 'class-validator';
import {
  maxNameLength,
  macLength,
  maxDescriptionLength,
} from 'src/constants/equipment-fields';

export class CreateEquipmentDto {
  @ApiProperty({
    description: 'O endereço MAC do equipamento',
    type: String,
    nullable: false,
    example: '00:00:00:00:00:00',
  })
  @IsMACAddress(
    {},
    {
      message: 'O endereço MAC do equipamento deve ser válido',
    },
  )
  @Length(macLength, undefined, {
    message: `O endereço MAC do equipamento deve ter exatamente ${macLength} caracteres`,
  })
  mac: string;

  @ApiProperty({
    description: 'O nome do equipamento',
    type: String,
    nullable: false,
    example: 'Equipamento 01',
    maxLength: maxNameLength,
  })
  @IsString({
    message: 'O nome do equipamento deve ser uma string',
  })
  @MinLength(1, {
    message: 'O nome do equipamento deve ter ao menos 1 caractere',
  })
  @MaxLength(maxNameLength, {
    message: `O nome do equipamento deve ter no máximo ${maxNameLength} caracteres`,
  })
  name: string;

  @ApiProperty({
    description: 'A descrição do equipamento',
    type: String,
    nullable: true,
    example: 'Equipamento de teste',
    maxLength: maxDescriptionLength,
  })
  @IsString({
    message: 'A descrição do equipamento deve ser uma string',
  })
  @MaxLength(maxDescriptionLength, {
    message: `A descrição do equipamento deve ter no máximo ${maxDescriptionLength} caracteres`,
  })
  description?: string;

  @ApiProperty({
    description: 'O código da concessionária do equipamento',
    type: String,
    nullable: false,
  })
  @IsString({
    message: 'O código da concessionária do equipamento deve ser uma string',
  })
  codConcessionaria: string;

  @ApiProperty({
    description: 'O código da unidade consumidora do equipamento',
    type: String,
    nullable: false,
  })
  @IsString({
    message: 'O código da unidade consumidora deve ser uma string',
  })
  codUnidadeConsumidora: string;

  @ApiProperty({
    description: 'UF do equipamento',
    type: String,
    nullable: false,
  })
  @IsString({
    message: 'UF do equipamento deve ser uma string',
  })
  @MaxLength(2, {
    message: 'UF do equipamento deve ter no máximo 2 caracteres',
  })
  uf: string;

  @ApiProperty({
    description: 'Cidade do equipamento',
    type: String,
    nullable: false,
  })
  @IsString({
    message: 'Cidade do equipamento deve ser uma string',
  })
  @MaxLength(255, {
    message: 'UF do equipamento deve ter no máximo 255 caracteres',
  })
  cidade: string;

  @ApiProperty({
    description: 'Subgrupo do equipamento',
    type: String,
    nullable: false,
  })
  @IsString({
    message: 'Subgrupo do equipamento deve ser uma string',
  })
  @MaxLength(255, {
    message: 'Subgrupo do equipamento deve ter no máximo 255 caracteres',
  })
  subgrupo: string;

  @ApiProperty({
    description: 'Tensão nominal do equipamento',
    type: Number,
    nullable: false,
  })
  @IsDecimal()
  tensaoNominal: Prisma.Decimal;

  @ApiProperty({
    description: 'Fases monitoradas do equipamento',
    type: String,
    nullable: false,
  })
  fases_monitoradas: Fases;
}

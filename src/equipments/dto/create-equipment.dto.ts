import { ApiProperty } from '@nestjs/swagger';
import {
  IsMACAddress,
  IsString,
  MaxLength,
  Length,
  MinLength,
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
}

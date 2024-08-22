import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  maxNameLength,
  maxDescriptionLength,
} from 'src/constants/equipment-fields';

export class UserUpdateEquipmentDto {
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
}

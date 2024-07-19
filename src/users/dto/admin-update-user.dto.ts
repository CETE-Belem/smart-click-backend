import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { maxEmailLength, maxNameLength } from 'src/constants/user-fields';
import { Cargo } from '@prisma/client';

export class AdminUpdateUserDto {
  @ApiProperty({
    description: 'Nome do usuário',
    type: String,
    example: 'John Doe',
    maxLength: maxNameLength,
  })
  @IsNotEmpty({
    message: 'O nome é obrigatório',
  })
  @IsString({
    message: 'O nome deve ser uma string',
  })
  @MaxLength(maxNameLength, {
    message: `O nome deve ter no máximo ${maxNameLength} caracteres`,
  })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    type: String,
    example: 'john.doe@amazontech.com',
    maxLength: maxEmailLength,
  })
  @IsNotEmpty({
    message: 'O email é obrigatório',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um email válido',
    },
  )
  @MaxLength(maxEmailLength, {
    message: `O email deve ter no máximo ${maxEmailLength} caracteres`,
  })
  email: string;

  @ApiProperty({
    description: 'Cargo do usuário',
    type: String,
    example: 'ADMIN',
  })
  @IsEnum(Cargo, {
    message: 'Cargo inválido',
  })
  role: Cargo;
}

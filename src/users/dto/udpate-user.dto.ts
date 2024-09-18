import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import {
  maxEmailLength,
  maxNameLength,
  maxPasswordLength,
  minPasswordLength,
  passwordRegex,
} from 'src/constants/user-fields';

export class UpdateUserDto {
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
    description: 'Senha do usuário',
    type: String,
    example: '@Abc1234',
    maxLength: maxPasswordLength,
    minLength: minPasswordLength,
  })
  @IsOptional({
    always: false,
  })
  @MinLength(minPasswordLength, {
    message: `A senha deve ter pelo menos ${minPasswordLength} caracteres`,
  })
  @MaxLength(maxPasswordLength, {
    message: `A senha deve ter menos de ${maxPasswordLength} caracteres`,
  })
  @IsString({
    message: 'A senha deve ser uma string',
  })
  @Matches(passwordRegex, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  password: string;
}

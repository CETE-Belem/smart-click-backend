import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import {
  maxEmailLength,
  maxNameLength,
  maxPasswordLength,
  minPasswordLength,
  passwordRegex,
} from '../../constants/user-fields';

export class CreateAdminDto {
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
    example: 'john.doe@email.com',
    maxLength: maxEmailLength,
  })
  @IsNotEmpty({
    message: 'O email é obrigatorio',
  })
  @IsString({
    message: 'O email deve ser uma string',
  })
  @MaxLength(maxEmailLength, {
    message: `O email deve ter no máximo ${maxEmailLength} caracteres`,
  })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: String,
    example: '@Abc1234',
    minLength: minPasswordLength,
    maxLength: maxPasswordLength,
  })
  @IsNotEmpty({
    message: 'A senha é obrigatória',
  })
  @IsString({
    message: 'A senha deve ser uma string',
  })
  @Matches(passwordRegex, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial',
  })
  @MinLength(minPasswordLength, {
    message: `A senha deve ter pelo menos ${minPasswordLength} caracteres`,
  })
  @MaxLength(maxPasswordLength, {
    message: `A senha deve ter no máximo ${maxPasswordLength} caracteres`,
  })
  password: string;
}

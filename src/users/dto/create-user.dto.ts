import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Length,
} from 'class-validator';
import {
  minPasswordLength,
  maxNameLength,
  maxPasswordLength,
  passwordRegex,
  maxEmailLength,
} from '../../constants/user-fields';

export class CreateUserDto {
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
    description: 'Número de unidade consumidora',
    type: String,
    example: '12345678',
  })
  @IsNotEmpty({
    message: 'O número de unidade consumidora é obrigatório',
  })
  @IsString({
    message: 'O número de unidade consumidora deve ser uma string',
  })
  @Length(8, 8, {
    message: 'O número de unidade consumidora deve ter 8 caracteres',
  })
  @Matches(/^[0-9]+$/, {
    message: 'O número de unidade consumidora deve conter apenas números',
  })
  consumerUnityNumber: string;

  @ApiProperty({
    description: 'Senha do usuário',
    type: String,
    example: '@Abc1234',
    maxLength: maxPasswordLength,
    minLength: minPasswordLength,
  })
  @IsNotEmpty({
    message: 'Informe uma senha',
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
    type: String,
    description: 'Captcha Turnstile',
  })
  @IsNotEmpty({
    message: 'Informe o captcha',
  })
  @IsString({
    message: 'O captcha deve ser uma string',
  })
  captcha: string;
}

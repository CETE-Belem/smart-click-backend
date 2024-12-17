import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  minPasswordLength,
  maxEmailLength,
  maxPasswordLength,
  passwordRegex,
} from '../../constants/user-fields';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    type: String,
    example: 'john.doe@amazontech.com.br',
    maxLength: maxEmailLength,
  })
  @IsNotEmpty({
    message: 'Informe um endereço de email',
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido',
    },
  )
  @MaxLength(maxEmailLength, {
    message: `O endereço de email deve ter menos de ${maxEmailLength} caracteres`,
  })
  email: string;

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

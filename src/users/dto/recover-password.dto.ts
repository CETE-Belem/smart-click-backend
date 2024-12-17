import {
  Length,
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxPasswordLength,
  minPasswordLength,
  passwordRegex,
} from '../../constants/user-fields';

export class RecoverPasswordDto {
  @ApiProperty({
    description: 'Código de recuperação',
    type: String,
    example: '123456',
    nullable: false,
  })
  @IsNotEmpty({
    message: 'O código de recuperação é obrigatório',
  })
  @IsString({
    message: 'O código de recuperação deve ser uma string',
  })
  @Length(6, 6, {
    message: 'O código de recuperação deve ter 6 caracteres',
  })
  code: string;

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
}

import { Length, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmCodeDto {
  @ApiProperty({
    description: 'Código de confirmação',
    type: String,
    example: '123456',
    nullable: false,
  })
  @IsNotEmpty({
    message: 'O código de confirmação é obrigatório',
  })
  @IsString({
    message: 'O código de confirmação deve ser uma string',
  })
  @Length(6, 6, {
    message: 'O código de confirmação deve ter 6 caracteres',
  })
  code: string;
}

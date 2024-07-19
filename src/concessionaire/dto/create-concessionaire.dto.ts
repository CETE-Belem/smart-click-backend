import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, Length, IsString } from 'class-validator';

export class CreateConcessionaireDto {
  @ApiProperty({
    example: 'Concessionária Teste',
    type: String,
    maxLength: 150,
    nullable: false,
  })
  @IsString({
    message: 'O nome da concessionária deve ser uma string',
  })
  @IsNotEmpty({ message: 'O nome da concessionária é obrigatório' })
  @MaxLength(150, {
    message: 'O nome da concessionária deve ter no máximo 150 caracteres',
  })
  name: string;

  @ApiProperty({
    example: 'Cidade Teste',
    type: String,
    maxLength: 100,
    nullable: false,
  })
  @IsString({
    message: 'A cidade deve ser uma string',
  })
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @MaxLength(100, {
    message: 'A cidade deve ter no máximo 100 caracteres',
  })
  city: string;

  @ApiProperty({
    example: 'UF',
    type: String,
    maxLength: 2,
    nullable: false,
  })
  @IsString({
    message: 'A UF deve ser uma string',
  })
  @IsNotEmpty({ message: 'A UF é obrigatória' })
  @Length(2, 2, {
    message: 'A UF deve ter 2 caracteres',
  })
  uf: string;
}

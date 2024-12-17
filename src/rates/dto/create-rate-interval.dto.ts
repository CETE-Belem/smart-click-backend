import { ApiProperty } from '@nestjs/swagger';
import { Tipo_Tarifa } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsInt,
  IsPositive,
  Max,
  Min,
} from 'class-validator';
import { IsLesserOrEqualThan } from '../../validators';

export class CreateRateIntervalDto {
  @ApiProperty({
    type: Number,
    nullable: false,
  })
  @IsNotEmpty({ message: 'Campo [de] é obrigatório' })
  @IsNumber({}, { message: 'Campo [de] deve ser um número' })
  @IsInt({ message: 'Campo [de] deve ser um inteiro' })
  @Min(0, { message: 'Campo [de] deve ser maior ou igual a 0 minutos' })
  @Max(1439, {
    message: 'Campo [de] pode possuir um valor inicial de até 1439 minutos',
  })
  @IsLesserOrEqualThan('ate', {
    message: 'Campo [de] deve ser menor que campo [ate]',
  })
  de: number;

  @ApiProperty({
    type: Number,
    nullable: false,
  })
  @IsNotEmpty({ message: 'Campo [ate] é obrigatório' })
  @IsNumber({}, { message: 'Campo [ate] deve ser um número' })
  @IsInt({ message: 'Campo [ate] deve ser um inteiro' })
  @Max(1439, {
    message: 'Campo [ate] pode possuir um valor inicial de até 1439 minutos',
  })
  @IsPositive({ message: 'Campo [ate] deve ser maior que 0 minutos' })
  ate: number;

  @ApiProperty({
    type: Number,
    nullable: false,
  })
  @IsNumber({}, { message: 'Campo [valor] deve ser um número' })
  @IsNotEmpty({ message: 'Campo [valor] é obrigatório' })
  @Transform(({ value }) => parseFloat(value))
  valor: number;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @IsEnum(Tipo_Tarifa, { message: 'Campo [tipo] deve ser Tipo_Tarifa' })
  @IsNotEmpty({ message: 'Campo [tipo] é obrigatório' })
  tipo: Tipo_Tarifa;
}

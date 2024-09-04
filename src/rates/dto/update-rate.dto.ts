import { ApiProperty } from '@nestjs/swagger';
import { Subgrupo } from '@prisma/client';
import {
  IsNumber,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateRateIntervalDto } from './create-rate-interval.dto';
import { UpdateRateIntervalDto } from './update-rate-interval.dto';

export class UpdateRateDto {
  // @ApiProperty({
  //   type: String,
  //   nullable: false,
  // })
  // @IsString({
  //   message: 'O id da tarifa deve ser uma string',
  // })
  // @IsNotEmpty({
  //   message: 'O id da tarifa é obrigatório',
  // })
  // cod_tarifa: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @IsString({
    message: 'O id da concessionária deve ser uma string',
  })
  @IsNotEmpty({
    message: 'O id da concessionária é obrigatório',
  })
  cod_concessionaria: string;

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  @IsNotEmpty({
    message: 'A Data da Tarifa é obrigatória',
  })
  @IsDateString(
    {
      strict: true,
      strictSeparator: true,
    },
    { message: 'A Data da Tarifa deve ser do tipo Date' },
  )
  dt_tarifa: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  @IsEnum(Subgrupo, {
    message: 'Subgrupo do equipamento deve ser um subgrupo',
  })
  @IsNotEmpty({
    message: 'O Subgrupo é obrigatório',
  })
  subgrupo: Subgrupo;

  @ApiProperty({
    type: Number,
    nullable: false,
  })
  @IsNumber({}, { message: 'O Valor deve ser um número' })
  @Transform(({ value }) => parseFloat(value))
  valor: number;

  @ApiProperty({
    isArray: true,
    type: CreateRateIntervalDto,
    nullable: false,
  })
  @ValidateNested({ each: true })
  @Type(() => CreateRateIntervalDto)
  @IsOptional()
  intervalos_tarifas?: CreateRateIntervalDto[] | UpdateRateIntervalDto[];
}

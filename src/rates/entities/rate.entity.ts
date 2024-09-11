import { ApiProperty } from '@nestjs/swagger';
import { Subgrupo, Tarifa } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { RateIntervalEntity } from './rate-interval.entity';
import { Transform } from 'class-transformer';
import { ConcessionaireEntity } from 'src/concessionaires/entities/concessionaire.entity';

export class RateEntity implements Tarifa {
  constructor(partial: Partial<RateEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    type: String,
    nullable: false,
  })
  cod_concessionaria: string;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  cod_tarifa: string;

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  dt_tarifa: Date;

  @ApiProperty({
    type: Subgrupo,
    nullable: false,
  })
  subgrupo: Subgrupo;

  @ApiProperty({
    type: Number,
    nullable: false,
  })
  @Transform(({ value }) => parseFloat(value))
  valor: Decimal;

  @ApiProperty({
    type: ConcessionaireEntity,
    nullable: false,
  })
  concessionaria: ConcessionaireEntity;

  @ApiProperty({
    type: RateIntervalEntity,
    isArray: true,
    nullable: false,
  })
  intervalos_tarifas: RateIntervalEntity[];

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  criadoEm: Date;

  @ApiProperty({
    type: Date,
    nullable: false,
  })
  atualizadoEm: Date;
}

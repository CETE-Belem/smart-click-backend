import { ApiProperty } from '@nestjs/swagger';
import { Subgrupo, Tarifa } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { ConcessionaireEntity } from 'src/concessionaire/entities/concessionaire.entity';
import { RateIntervalEntity } from './rate-interval.entity';

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
  valor: Decimal;

  @ApiProperty({
    type: ConcessionaireEntity,
    nullable: false,
  })
  concessionaria: ConcessionaireEntity;

  @ApiProperty({
    type: () => RateIntervalEntity,
    isArray: true,
    nullable: false,
  })
  intervalo_tarifa: RateIntervalEntity[];
}

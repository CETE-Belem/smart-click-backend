import { ApiProperty } from '@nestjs/swagger';
import { Intervalo_Tarifa, Tipo_Tarifa } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class RateIntervalEntity implements Intervalo_Tarifa {
  constructor(partial: Partial<RateIntervalEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    type: String,
    nullable: false,
  })
  cod_intervalo_tarifa: string;

  @ApiProperty({
    type: Number,
    nullable: false,
  })
  de: number;

  @ApiProperty({
    type: Number,
    nullable: false,
  })
  ate: number;

  @ApiProperty({
    type: Number,
    nullable: false,
  })
  valor: Decimal;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  tipo: Tipo_Tarifa;

  @ApiProperty({
    type: String,
    nullable: false,
  })
  cod_tarifa: string;

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

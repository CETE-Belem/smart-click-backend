import { ApiProperty } from '@nestjs/swagger';

export class PhaseChartData {
  @ApiProperty({
    description: 'Tensão (v)',
    type: Number,
    nullable: false,
  })
  v: number;

  @ApiProperty({
    description: 'Corrente (i)',
    type: Number,
    nullable: false,
  })
  i: number;

  @ApiProperty({
    description: 'Potência Aparente',
    type: Number,
    nullable: false,
  })
  potenciaAparente: number;

  @ApiProperty({
    description: 'Potência Ativa',
    type: Number,
    nullable: false,
  })
  potenciaAtiva: number;

  @ApiProperty({
    description: 'Fator de Potência (FP)',
    type: Number,
    nullable: false,
  })
  FP: number;
}

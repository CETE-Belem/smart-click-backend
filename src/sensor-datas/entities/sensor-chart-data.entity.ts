import { ApiProperty } from '@nestjs/swagger';
import {
  media_anual,
  media_diaria,
  media_mensal,
  Dado_Sensor,
} from '@prisma/client';
import { PhaseChartData } from './phase-chart-data.entity';

export class SensorChartDataEntity {
  @ApiProperty({
    description: 'Data',
    type: String,
    nullable: false,
  })
  date: Date;

  @ApiProperty({
    description: 'Fase A',
    type: PhaseChartData,
    nullable: false,
  })
  faseA: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };

  @ApiProperty({
    description: 'Fase B',
    type: PhaseChartData,
    nullable: true,
  })
  faseB?: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };

  @ApiProperty({
    description: 'Fase C',
    type: PhaseChartData,
    nullable: true,
  })
  faseC?: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };

  private constructor(
    date: Date,
    faseA: {
      v: number;
      i: number;
      potenciaAparente: number;
      potenciaAtiva: number;
      FP: number;
    },
    faseB?: {
      v: number;
      i: number;
      potenciaAparente: number;
      potenciaAtiva: number;
      FP: number;
    },
    faseC?: {
      v: number;
      i: number;
      potenciaAparente: number;
      potenciaAtiva: number;
      FP: number;
    },
  ) {
    this.date = date;
    this.faseA = faseA;
    this.faseB = faseB;
    this.faseC = faseC;
  }

  static fromDadoSensor(data: Dado_Sensor): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.data,
      {
        v: data.vA ?? 0,
        i: data.iA ?? 0,
        potenciaAparente: data.potenciaAparenteA ?? 0,
        potenciaAtiva: data.potenciaAtivaA ?? 0,
        FP: data.FPA ?? 0,
      },
      data.vB
        ? {
            v: data.vB ?? 0,
            i: data.iB ?? 0,
            potenciaAparente: data.potenciaAparenteB ?? 0,
            potenciaAtiva: data.potenciaAtivaB ?? 0,
            FP: data.FPB ?? 0,
          }
        : undefined,
      data.vC
        ? {
            v: data.vC ?? 0,
            i: data.iC ?? 0,
            potenciaAparente: data.potenciaAparenteC ?? 0,
            potenciaAtiva: data.potenciaAtivaC ?? 0,
            FP: data.FPC ?? 0,
          }
        : undefined,
    );
  }

  static fromMediaDiaria(data: media_diaria): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.data,
      {
        v: +(data.media_va?.toFixed(2) ?? '0.00'),
        i: +(data.media_ia?.toFixed(2) ?? '0.00'),
        potenciaAparente: +(data.media_potenciaaparentea?.toFixed(2) ?? '0.00'),
        potenciaAtiva: +(data.media_potenciaativaa?.toFixed(2) ?? '0.00'),
        FP: +(data.media_fpa?.toFixed(2) ?? '0.00'),
      },
      data.media_vb
        ? {
            v: +(data.media_vb?.toFixed(2) ?? '0.00'),
            i: +(data.media_ib?.toFixed(2) ?? '0.00'),
            potenciaAparente: +(
              data.media_potenciaaparenteb?.toFixed(2) ?? '0.00'
            ),
            potenciaAtiva: +(data.media_potenciaativab?.toFixed(2) ?? '0.00'),
            FP: +(data.media_fpb?.toFixed(2) ?? '0.00'),
          }
        : undefined,
      data.media_vc
        ? {
            v: +(data.media_vc?.toFixed(2) ?? '0.00'),
            i: +(data.media_ic?.toFixed(2) ?? '0.00'),
            potenciaAparente: +(
              data.media_potenciaaparentec?.toFixed(2) ?? '0.00'
            ),
            potenciaAtiva: +(data.media_potenciaativac?.toFixed(2) ?? '0.00'),
            FP: +(data.media_fpc?.toFixed(2) ?? '0.00'),
          }
        : undefined,
    );
  }

  static fromMediaMensal(data: media_mensal): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.mes,
      {
        v: +(data.media_va?.toFixed(2) ?? '0.00'),
        i: +(data.media_ia?.toFixed(2) ?? '0.00'),
        potenciaAparente: +(data.media_potenciaaparentea?.toFixed(2) ?? '0.00'),
        potenciaAtiva: +(data.media_potenciaativaa?.toFixed(2) ?? '0.00'),
        FP: +(data.media_fpa?.toFixed(2) ?? '0.00'),
      },
      data.media_vb
        ? {
            v: +(data.media_vb?.toFixed(2) ?? '0.00'),
            i: +(data.media_ib?.toFixed(2) ?? '0.00'),
            potenciaAparente: +(
              data.media_potenciaaparenteb?.toFixed(2) ?? '0.00'
            ),
            potenciaAtiva: +(data.media_potenciaativab?.toFixed(2) ?? '0.00'),
            FP: +(data.media_fpb?.toFixed(2) ?? '0.00'),
          }
        : undefined,
      data.media_vc
        ? {
            v: +(data.media_vc?.toFixed(2) ?? '0.00'),
            i: +(data.media_ic?.toFixed(2) ?? '0.00'),
            potenciaAparente: +(
              data.media_potenciaaparentec?.toFixed(2) ?? '0.00'
            ),
            potenciaAtiva: +(data.media_potenciaativac?.toFixed(2) ?? '0.00'),
            FP: +(data.media_fpc?.toFixed(2) ?? '0.00'),
          }
        : undefined,
    );
  }

  static fromMediaAnual(data: media_anual): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.ano,
      {
        v: +(data.media_va?.toFixed(2) ?? '0.00'),
        i: +(data.media_ia?.toFixed(2) ?? '0.00'),
        potenciaAparente: +(data.media_potenciaaparentea?.toFixed(2) ?? '0.00'),
        potenciaAtiva: +(data.media_potenciaativaa?.toFixed(2) ?? '0.00'),
        FP: +(data.media_fpa?.toFixed(2) ?? '0.00'),
      },
      data.media_vb
        ? {
            v: +(data.media_vb?.toFixed(2) ?? '0.00'),
            i: +(data.media_ib?.toFixed(2) ?? '0.00'),
            potenciaAparente: +(
              data.media_potenciaaparenteb?.toFixed(2) ?? '0.00'
            ),
            potenciaAtiva: +(data.media_potenciaativab?.toFixed(2) ?? '0.00'),
            FP: +(data.media_fpb?.toFixed(2) ?? '0.00'),
          }
        : undefined,
      data.media_vc
        ? {
            v: +(data.media_vc?.toFixed(2) ?? '0.00'),
            i: +(data.media_ic?.toFixed(2) ?? '0.00'),
            potenciaAparente: +(
              data.media_potenciaaparentec?.toFixed(2) ?? '0.00'
            ),
            potenciaAtiva: +(data.media_potenciaativac?.toFixed(2) ?? '0.00'),
            FP: +(data.media_fpc?.toFixed(2) ?? '0.00'),
          }
        : undefined,
    );
  }
}

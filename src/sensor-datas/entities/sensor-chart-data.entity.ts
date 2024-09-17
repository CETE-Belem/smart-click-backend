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
        v: data.vA!,
        i: data.iA!,
        potenciaAparente: data.potenciaAparenteA!,
        potenciaAtiva: data.potenciaAtivaA!,
        FP: data.FPA!,
      },
      data.vB
        ? {
            v: data.vB!,
            i: data.iB!,
            potenciaAparente: data.potenciaAparenteB!,
            potenciaAtiva: data.potenciaAtivaB!,
            FP: data.FPB!,
          }
        : undefined,
      data.vC
        ? {
            v: data.vC!,
            i: data.iC!,
            potenciaAparente: data.potenciaAparenteC!,
            potenciaAtiva: data.potenciaAtivaC!,
            FP: data.FPC!,
          }
        : undefined,
    );
  }

  static fromMediaDiaria(data: media_diaria): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.data,
      {
        v: parseFloat(data.media_va!.toFixed(2)),
        i: parseFloat(data.media_ia!.toFixed(2)),
        potenciaAparente: parseFloat(data.media_potenciaaparentea!.toFixed(2)),
        potenciaAtiva: parseFloat(data.media_potenciaativaa!.toFixed(2)),
        FP: parseFloat(data.media_fpa!.toFixed(2)),
      },
      data.media_vb
        ? {
            v: parseFloat(data.media_vb!.toFixed(2)),
            i: parseFloat(data.media_ib!.toFixed(2)),
            potenciaAparente: parseFloat(
              data.media_potenciaaparenteb!.toFixed(2),
            ),
            potenciaAtiva: parseFloat(data.media_potenciaativab!.toFixed(2)),
            FP: parseFloat(data.media_fpb!.toFixed(2)),
          }
        : undefined,
      data.media_vc
        ? {
            v: parseFloat(data.media_vc!.toFixed(2)),
            i: parseFloat(data.media_ic!.toFixed(2)),
            potenciaAparente: parseFloat(
              data.media_potenciaaparentec!.toFixed(2),
            ),
            potenciaAtiva: parseFloat(data.media_potenciaativac!.toFixed(2)),
            FP: parseFloat(data.media_fpc!.toFixed(2)),
          }
        : undefined,
    );
  }

  static fromMediaMensal(data: media_mensal): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.mes,
      {
        v: parseFloat(data.media_va!.toFixed(2)),
        i: parseFloat(data.media_ia!.toFixed(2)),
        potenciaAparente: parseFloat(data.media_potenciaaparentea!.toFixed(2)),
        potenciaAtiva: parseFloat(data.media_potenciaativaa!.toFixed(2)),
        FP: parseFloat(data.media_fpa!.toFixed(2)),
      },
      data.media_vb
        ? {
            v: parseFloat(data.media_vb!.toFixed(2)),
            i: parseFloat(data.media_ib!.toFixed(2)),
            potenciaAparente: parseFloat(
              data.media_potenciaaparenteb!.toFixed(2),
            ),
            potenciaAtiva: parseFloat(data.media_potenciaativab!.toFixed(2)),
            FP: parseFloat(data.media_fpb!.toFixed(2)),
          }
        : undefined,
      data.media_vc
        ? {
            v: parseFloat(data.media_vc!.toFixed(2)),
            i: parseFloat(data.media_ic!.toFixed(2)),
            potenciaAparente: parseFloat(
              data.media_potenciaaparentec!.toFixed(2),
            ),
            potenciaAtiva: parseFloat(data.media_potenciaativac!.toFixed(2)),
            FP: parseFloat(data.media_fpc!.toFixed(2)),
          }
        : undefined,
    );
  }

  static fromMediaAnual(data: media_anual): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.ano,
      {
        v: parseFloat(data.media_va!.toFixed(2)),
        i: parseFloat(data.media_ia!.toFixed(2)),
        potenciaAparente: parseFloat(data.media_potenciaaparentea!.toFixed(2)),
        potenciaAtiva: parseFloat(data.media_potenciaativaa!.toFixed(2)),
        FP: parseFloat(data.media_fpa!.toFixed(2)),
      },
      data.media_vb
        ? {
            v: parseFloat(data.media_vb!.toFixed(2)),
            i: parseFloat(data.media_ib!.toFixed(2)),
            potenciaAparente: parseFloat(
              data.media_potenciaaparenteb!.toFixed(2),
            ),
            potenciaAtiva: parseFloat(data.media_potenciaativab!.toFixed(2)),
            FP: parseFloat(data.media_fpb!.toFixed(2)),
          }
        : undefined,
      data.media_vc
        ? {
            v: parseFloat(data.media_vc!.toFixed(2)),
            i: parseFloat(data.media_ic!.toFixed(2)),
            potenciaAparente: parseFloat(
              data.media_potenciaaparentec!.toFixed(2),
            ),
            potenciaAtiva: parseFloat(data.media_potenciaativac!.toFixed(2)),
            FP: parseFloat(data.media_fpc!.toFixed(2)),
          }
        : undefined,
    );
  }
}

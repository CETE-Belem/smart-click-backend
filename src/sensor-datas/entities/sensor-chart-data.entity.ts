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
        v: data.media_va!,
        i: data.media_ia!,
        potenciaAparente: data.media_potenciaaparentea!,
        potenciaAtiva: data.media_potenciaativaa!,
        FP: data.media_fpa!,
      },
      data.media_vb
        ? {
            v: data.media_vb!,
            i: data.media_ib!,
            potenciaAparente: data.media_potenciaaparenteb!,
            potenciaAtiva: data.media_potenciaativab!,
            FP: data.media_fpb!,
          }
        : undefined,
      data.media_vc
        ? {
            v: data.media_vc!,
            i: data.media_ic!,
            potenciaAparente: data.media_potenciaaparentec!,
            potenciaAtiva: data.media_potenciaativac!,
            FP: data.media_fpc!,
          }
        : undefined,
    );
  }

  static fromMediaMensal(data: media_mensal): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.mes,
      {
        v: data.media_va!,
        i: data.media_ia!,
        potenciaAparente: data.media_potenciaaparentea!,
        potenciaAtiva: data.media_potenciaativaa!,
        FP: data.media_fpa!,
      },
      data.media_vb
        ? {
            v: data.media_vb!,
            i: data.media_ib!,
            potenciaAparente: data.media_potenciaaparenteb!,
            potenciaAtiva: data.media_potenciaativab!,
            FP: data.media_fpb!,
          }
        : undefined,
      data.media_vc
        ? {
            v: data.media_vc!,
            i: data.media_ic!,
            potenciaAparente: data.media_potenciaaparentec!,
            potenciaAtiva: data.media_potenciaativac!,
            FP: data.media_fpc!,
          }
        : undefined,
    );
  }

  static fromMediaAnual(data: media_anual): SensorChartDataEntity {
    return new SensorChartDataEntity(
      data.ano,
      {
        v: data.media_va!,
        i: data.media_ia!,
        potenciaAparente: data.media_potenciaaparentea!,
        potenciaAtiva: data.media_potenciaativaa!,
        FP: data.media_fpa!,
      },
      data.media_vb
        ? {
            v: data.media_vb!,
            i: data.media_ib!,
            potenciaAparente: data.media_potenciaaparenteb!,
            potenciaAtiva: data.media_potenciaativab!,
            FP: data.media_fpb!,
          }
        : undefined,
      data.media_vc
        ? {
            v: data.media_vc!,
            i: data.media_ic!,
            potenciaAparente: data.media_potenciaaparentec!,
            potenciaAtiva: data.media_potenciaativac!,
            FP: data.media_fpc!,
          }
        : undefined,
    );
  }
}

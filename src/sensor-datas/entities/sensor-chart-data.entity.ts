import { Dado_Sensor } from '@prisma/client';

export class SensorChartDataEntity {
  constructor(data: Dado_Sensor) {
    this.date = data.data;
    this.faseA = {
      v: data.vA,
      i: data.iA,
      potenciaAparente: data.potenciaAparenteA,
      potenciaAtiva: data.potenciaAtivaA,
      FP: data.FPA,
    };
    if (data.vB) {
      this.faseB = {
        v: data.vB,
        i: data.iB,
        potenciaAparente: data.potenciaAparenteB,
        potenciaAtiva: data.potenciaAtivaB,
        FP: data.FPB,
      };
    }
    if (data.vC) {
      this.faseC = {
        v: data.vC,
        i: data.iC,
        potenciaAparente: data.potenciaAparenteC,
        potenciaAtiva: data.potenciaAtivaC,
        FP: data.FPC,
      };
    }
  }
  date: Date;
  faseA: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };
  faseB?: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };
  faseC?: {
    v: number;
    i: number;
    potenciaAparente: number;
    potenciaAtiva: number;
    FP: number;
  };
}

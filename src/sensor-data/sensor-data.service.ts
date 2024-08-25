import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SensorDataService {
  constructor(private readonly prismaService: PrismaService) {}

  async handleData(data: string, mac: string) {
    const dataSplitted = data.split('|');

    const phaseCount = Number(dataSplitted[0]);
    const vA = Number(dataSplitted[1].replace('V', ''));
    const iA = Number(dataSplitted[2].replace('A', ''));
    const potenciaAparente = Number(dataSplitted[3].replace('VA', ''));
    const potenciaAtiva = Number(dataSplitted[4].replace('W', ''));
    const fatorPotencia = Number(dataSplitted[5]);
    const vB = phaseCount > 1 ? Number(dataSplitted[6].replace('V', '')) : null;
    const iB = phaseCount > 1 ? Number(dataSplitted[7].replace('A', '')) : null;
    const potenciaAparenteB =
      phaseCount > 1 ? Number(dataSplitted[8].replace('VA', '')) : null;
    const potenciaAtivaB =
      phaseCount > 1 ? Number(dataSplitted[9].replace('W', '')) : null;
    const fatorPotenciaB = phaseCount > 1 ? Number(dataSplitted[10]) : null;
    const vC =
      phaseCount > 2 ? Number(dataSplitted[11].replace('V', '')) : null;
    const iC =
      phaseCount > 2 ? Number(dataSplitted[12].replace('A', '')) : null;
    const potenciaAparenteC =
      phaseCount > 2 ? Number(dataSplitted[13].replace('VA', '')) : null;
    const potenciaAtivaC =
      phaseCount > 2 ? Number(dataSplitted[14].replace('W', '')) : null;
    const fatorPotenciaC = phaseCount > 2 ? Number(dataSplitted[15]) : null;

    // const sensorData = await this.prismaService.dado_Sensor.create({
    //   data: {
    //     vA,
    //     vB,
    //     vC,
    //     iA,
    //     iB,
    //     iC,
    //   },
    // });
  }
}

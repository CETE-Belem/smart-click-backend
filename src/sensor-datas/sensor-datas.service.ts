import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { SensorChartDataEntity } from './entities/sensor-chart-data.entity';

@Injectable()
export class SensorDataService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject('winston') private logger: Logger,
  ) {}

  async handleData(data: string, mac: string) {
    try {
      // const pattern = /^(\d+(\.\d+)?)(\|(\d+(\.\d+)?))*$/;

      // if (!pattern.test(data)) {
      //   throw new Error('Invalid data');
      // }

      const dataSplitted = data.split('|');
      const phaseCount = Number(dataSplitted[0]);
      const vA = Number(dataSplitted[1].replace('V', ''));
      const iA = Number(dataSplitted[2].replace('A', ''));
      const potenciaAparenteA = Number(dataSplitted[3].replace('VA', ''));
      const potenciaAtivaA = Number(dataSplitted[4].replace('W', ''));
      const FPA = Number(dataSplitted[5]);
      const vB =
        phaseCount > 1 ? Number(dataSplitted[6].replace('V', '')) : null;
      const iB =
        phaseCount > 1 ? Number(dataSplitted[7].replace('A', '')) : null;
      const potenciaAparenteB =
        phaseCount > 1 ? Number(dataSplitted[8].replace('VA', '')) : null;
      const potenciaAtivaB =
        phaseCount > 1 ? Number(dataSplitted[9].replace('W', '')) : null;
      const FPB = phaseCount > 1 ? Number(dataSplitted[10]) : null;
      const vC =
        phaseCount > 2 ? Number(dataSplitted[11].replace('V', '')) : null;
      const iC =
        phaseCount > 2 ? Number(dataSplitted[12].replace('A', '')) : null;
      const potenciaAparenteC =
        phaseCount > 2 ? Number(dataSplitted[13].replace('VA', '')) : null;
      const potenciaAtivaC =
        phaseCount > 2 ? Number(dataSplitted[14].replace('W', '')) : null;
      const FPC = phaseCount > 2 ? Number(dataSplitted[15]) : null;
      await this.prismaService.dado_Sensor.create({
        data: {
          vA,
          iA,
          potenciaAparenteA,
          potenciaAtivaA,
          FPA,
          vB,
          iB,
          potenciaAparenteB,
          potenciaAtivaB,
          FPB,
          vC,
          iC,
          potenciaAparenteC,
          potenciaAtivaC,
          FPC,
          data: await this.prismaService.dado_Sensor
            .findFirstOrThrow({
              where: {
                equipamento: {
                  mac,
                },
              },
              orderBy: {
                data: 'desc',
              },
            })
            .then(({ data }) => dayjs(data).add(5, 'minutes').toDate())
            .catch(() => new Date()),
          equipamento: {
            connect: {
              mac,
            },
          },
        },
      });
    } catch (e) {
      console.log(e.message);
      this.logger.error(e.message);
      //this.handleData(data, mac);
    }
  }

  async getChartData(equipmentId: string, from: Date, to: Date) {
    const equipamento = await this.prismaService.equipamento.findFirst({
      where: {
        mac: equipmentId,
      },
    });

    if (!equipamento) {
      throw new NotFoundException('Equipamento não encontrado');
    }

    const data = await this.prismaService.dado_Sensor.findMany({
      where: {
        equipamento: {
          cod_equipamento: equipmentId,
        },
        data: {
          gte: from,
          lte: to,
        },
      },
    });
    return data.map((d) => new SensorChartDataEntity(d));
  }
}

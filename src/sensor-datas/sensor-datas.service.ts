import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { SensorChartDataEntity } from './entities/sensor-chart-data.entity';
import { media_anual, media_diaria, media_mensal } from '@prisma/client';
import { EnergyService } from './services/energy.service';

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
          vA: Math.abs(vA),
          iA,
          potenciaAparenteA: Math.abs(potenciaAparenteA),
          potenciaAtivaA: Math.abs(potenciaAtivaA),
          FPA: Math.abs(FPA),
          vB: vB ? Math.abs(vB) : null,
          iB,
          potenciaAparenteB: potenciaAparenteB
            ? Math.abs(potenciaAparenteB)
            : null,
          potenciaAtivaB: potenciaAtivaB ? Math.abs(potenciaAtivaB) : null,
          FPB: FPB ? Math.abs(FPB) : null,
          vC: vC ? Math.abs(vC) : null,
          iC,
          potenciaAparenteC: potenciaAparenteC
            ? Math.abs(potenciaAparenteC)
            : null,
          potenciaAtivaC: potenciaAtivaC ? Math.abs(potenciaAtivaC) : null,
          FPC: FPC ? Math.abs(FPC) : null,
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

  // async getChartData(equipmentId: string, from: Date, to: Date) {
  //   const equipamento = await this.prismaService.equipamento.findFirst({
  //     where: {
  //       cod_equipamento: equipmentId,
  //     },
  //   });

  //   if (!equipamento) {
  //     throw new NotFoundException('Equipamento não encontrado');
  //   }

  //   const data = await this.prismaService.dado_Sensor.findMany({
  //     where: {
  //       equipamento: {
  //         cod_equipamento: equipmentId,
  //       },
  //       data: {
  //         gte: from,
  //         lte: to,
  //       },
  //     },
  //   });
  //   return data.map((d) => new SensorChartDataEntity(d));
  // }

  async getChartData(equipmentId: string, from: Date, to: Date) {
    const equipamento = await this.prismaService.equipamento.findFirst({
      where: {
        cod_equipamento: equipmentId,
      },
    });

    if (!equipamento) {
      throw new NotFoundException('Equipamento não encontrado');
    }

    to = new Date(to);
    from = new Date(from);

    const diffInDays = Math.ceil(
      (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
    );

    let data: any[];

    if (diffInDays > 30) {
      // Média mensal
      data = await this.prismaService.media_mensal.findMany({
        where: {
          cod_equipamento: equipmentId,
          mes: {
            gte: from,
            lte: to,
          },
        },
      });

      return data.map((d) => SensorChartDataEntity.fromMediaMensal(d));
    } else if (diffInDays > 365) {
      // Média anual ou dados diários
      data = await this.prismaService.media_anual.findMany({
        where: {
          cod_equipamento: equipmentId,
          ano: {
            gte: from,
            lte: to,
          },
        },
      });

      return data.map((d) => SensorChartDataEntity.fromMediaAnual(d));
    } else if (diffInDays > 1) {
      // Média diária
      data = await this.prismaService.media_diaria.findMany({
        where: {
          cod_equipamento: equipmentId,
          data: {
            gte: from,
            lte: to,
          },
        },
      });
      return data.map((d) => SensorChartDataEntity.fromMediaDiaria(d));
    } else {
      data = await this.prismaService.dado_Sensor.findMany({
        where: {
          cod_equipamento: equipmentId,
          data: {
            gte: from,
            lte: to,
          },
        },
      });
      console.log(data.length);
      return data.map((d) => SensorChartDataEntity.fromDadoSensor(d));
    }
  }

  async getEnergyConsumption(equipmentId: string, from: Date, to: Date) {
    const energyService = new EnergyService(this.prismaService);

    await energyService.SetEquipment(equipmentId, from, to);

    return;
    to = new Date(to);
    from = new Date(from);

    // const diffInDays = Math.ceil(
    //   (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
    // );

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

    if (!data) {
      throw new NotFoundException('Dados não encontrados');
    }

    const diffInHours = dayjs(to).diff(from, 'hour');

    const totalEnergy =
      data.reduce(
        (acc, d) =>
          acc + d.potenciaAtivaA + d.potenciaAparenteB + d.potenciaAparenteC,
        0,
      ) * diffInHours;
  }
}

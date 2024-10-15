import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';
import { SensorChartDataEntity } from './entities/sensor-chart-data.entity';
import { Intervalo_Tarifa } from '@prisma/client';
import { convertTimeToMinutes } from 'src/services/utils/convert-time.utils';
import { MailService } from 'src/mail/mail.service';
import EnergyReport from 'emails/energy-report';

@Injectable()
export class SensorDataService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
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

      const date = dataSplitted[16];
      const time = dataSplitted[17];

      const [day, month, year] = date.split('/');
      const fullYear = year.length === 2 ? `20${year}` : year;
      const isoDateTime = `${fullYear}-${month}-${day}T${time}-03:00`;
      const formattedDate = dayjs(isoDateTime).toDate();

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
          data: formattedDate,
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
      return data.map((d) => SensorChartDataEntity.fromDadoSensor(d));
    }
  }

  async getEnergyConsumption(equipmentId: string, from: Date, to: Date) {
    const conventionals: Map<Date, number> = new Map();
    const rates: Map<Date, Intervalo_Tarifa[]> = new Map();

    const unidadeConsumidora = await this.prismaService.equipamento.findUnique({
      where: {
        cod_equipamento: equipmentId,
      },
      select: {
        unidade_consumidora: {
          select: {
            subgrupo: true,
          },
        },
      },
    });

    const unidadeSubgroup = unidadeConsumidora?.unidade_consumidora?.subgrupo;

    if (!unidadeSubgroup) {
      throw new NotFoundException('Subgrupo não encontrado');
    }

    const equipment = await this.prismaService.equipamento
      .findUniqueOrThrow({
        where: {
          cod_equipamento: equipmentId,
        },
        include: {
          unidade_consumidora: {
            include: {
              usuario: true,
              concessionaria: {
                include: {
                  tarifas: {
                    where: {
                      AND: [
                        {
                          OR: [
                            {
                              dt_tarifa: {
                                lte: dayjs(to).startOf('day').toDate(),
                                gte: dayjs(from).endOf('day').toDate(),
                              },
                            },
                            {
                              dt_tarifa: {
                                lte: dayjs().toDate(),
                              },
                            },
                          ],
                        },
                        {
                          subgrupo: unidadeSubgroup,
                        },
                      ],
                    },
                    orderBy: {
                      dt_tarifa: 'desc',
                    },
                    take: 1,
                    include: {
                      intervalos_tarifas: true,
                    },
                  },
                },
              },
            },
          },
          dados_sensor: {
            where: {
              data: {
                lte: dayjs(to).startOf('day').toDate(),
                gte: dayjs(from).endOf('day').toDate(),
              },
            },
          },
        },
      })
      .catch(() => {
        throw new NotFoundException('Equipamento não encontrado');
      });

    if (equipment.unidade_consumidora.concessionaria.tarifas.length === 0) {
      throw new NotFoundException(
        `Tarifa não encontrada para o intervalo de datas 
        ${dayjs(from).format('DD/MM/YYYY')} - 
        ${dayjs(to).format('DD/MM/YYYY')} 
        ou para o subgrupo ${unidadeSubgroup}`,
      );
    }

    equipment.unidade_consumidora.concessionaria.tarifas.forEach((e) => {
      conventionals.set(e.dt_tarifa, Number(e.valor));
      rates.set(e.dt_tarifa, e.intervalos_tarifas);
    });

    let valueTB = 0;
    let valueConv = 0;

    equipment.dados_sensor
      .sort((a, b) => a.data.getTime() - b.data.getTime())
      .forEach((e, index) => {
        // First element never have consumption
        if (index === 0) return;

        const date = dayjs(e.data);

        const rate = rates.get(this.getClosestDate(rates, date.toDate())!);

        const conventional = conventionals.get(
          this.getClosestDate(conventionals, date.toDate())!,
        );

        // Power sum in Watts
        const pot =
          (e.potenciaAtivaA + e.potenciaAtivaB + e.potenciaAtivaC) / 1000;

        // Collections time difference in Hours
        const deltaT = dayjs(e.data).diff(
          dayjs(equipment.dados_sensor[index - 1].data),
          'hour',
          true,
        );

        const energyConsumption = pot * deltaT;
        const collectTimeInMinutes = convertTimeToMinutes(date, 'HH:mm');

        const rateToThisTime = rate.find(
          (r) => r.de <= collectTimeInMinutes && r.ate >= collectTimeInMinutes,
        );

        if (!rateToThisTime) {
          throw new NotFoundException(
            `Intervalo de tarifa não encontrado para data ${date.format('DD/MM/YYYY')} e hora ${date.format('HH:MM')}`,
          );
        }

        valueTB += energyConsumption * Number(rateToThisTime.valor);
        valueConv += energyConsumption * conventional;
      });

    const userEmail = equipment.unidade_consumidora.usuario.email;
    const optanteTB = equipment.unidade_consumidora.optanteTB;
    this.mailService
      .sendMail({
        email: userEmail,
        subject: 'Seu relatório de energia está disponível',
        template: EnergyReport({
          valueConv,
          valueTB,
          from,
          to,
          optanteTB,
          equipmentName: equipment.nome,
        }),
      })
      .then(() => {
        console.log(`Email de relatório de energia enviado para ${userEmail}`);
      });

    return {
      ok: true,
    };
  }

  private getClosestDate(
    map: Map<Date, any>,
    targetDate: Date,
  ): Date | undefined {
    let closestDate: Date | undefined;
    let minDiff = Infinity;

    for (const date of map.keys()) {
      const diff = Math.abs(date.getTime() - targetDate.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closestDate = date;
      }
    }

    return closestDate;
  }
}

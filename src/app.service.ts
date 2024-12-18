import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SensorDataService } from './sensor-datas/sensor-datas.service';
import { PrismaService } from './prisma/prisma.service';
import dayjs from 'dayjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    // @Inject('winston') private readonly logger: Logger, // Removido para a vercel
    private readonly sensorDatasService: SensorDataService,
    private readonly prismaService: PrismaService,
  ) {}

  @Cron('0 6 1 * *')
  async onModuleInit() {
    // Get past month start and end date, and transform them to JS Date
    const currentDateLastMonth = dayjs().subtract(1, 'month');
    const startOfLastMonth = currentDateLastMonth.startOf('month').toDate();
    const endOfLastMonth = currentDateLastMonth.endOf('month').toDate();

    const equipments = await this.prismaService.equipamento.findMany();
    await Promise.all(
      equipments.map(async (equipment) => {
        return this.sensorDatasService.getEnergyConsumption(
          equipment.cod_equipamento,
          startOfLastMonth,
          endOfLastMonth,
        );
      }),
    );
  }
}

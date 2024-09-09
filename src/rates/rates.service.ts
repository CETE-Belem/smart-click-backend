import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateEntity } from './entities/rate.entity';
import { CreateRateIntervalDto } from './dto/create-rate-interval.dto';
import { UpdateRateIntervalDto } from './dto/update-rate-interval.dto';
import { UpdateRateDto } from './dto/update-rate.dto';

@Injectable()
export class RatesService {
  constructor(private readonly prismaService: PrismaService) {}

  private completeIntervals(
    intervals: CreateRateIntervalDto[] | UpdateRateIntervalDto[],
    valor: number,
  ): CreateRateIntervalDto[] | UpdateRateIntervalDto[] {
    const completedIntervals: CreateRateIntervalDto[] = [...intervals];

    if (completedIntervals[completedIntervals.length - 1].ate < 1440) {
      completedIntervals.push({
        de: completedIntervals[completedIntervals.length - 1].ate,
        ate: 1440,
        tipo: 'FORA_DE_PONTA',
        valor,
      });
    }

    if (completedIntervals[0].de > 0) {
      completedIntervals.unshift({
        de: 0,
        ate: completedIntervals[0].de,
        tipo: 'FORA_DE_PONTA',
        valor,
      });
    }

    for (let i = 0; i < completedIntervals.length - 1; i++) {
      if (completedIntervals[i].ate < completedIntervals[i + 1].de) {
        completedIntervals.splice(i + 1, 0, {
          de: completedIntervals[i].ate,
          ate: completedIntervals[i + 1].de,
          tipo: 'FORA_DE_PONTA',
          valor,
        });
        i++;
      }
    }

    return completedIntervals;
  }

  private prepareIntervals(
    valor: number,
    intervals?: CreateRateIntervalDto[] | UpdateRateIntervalDto[],
  ): CreateRateIntervalDto[] | UpdateRateIntervalDto[] {
    const defaultInterval: CreateRateIntervalDto = {
      de: 0,
      ate: 1440,
      tipo: 'FORA_DE_PONTA',
      valor,
    };

    const sortedIntervals = (
      intervals && intervals.length ? [...intervals] : [defaultInterval]
    ).sort((a, b) => a.de - b.de);

    return this.completeIntervals(sortedIntervals, valor);
  }

  private areIntervalsValid(intervals: CreateRateIntervalDto[]): boolean {
    for (let i = 0; i < intervals.length; i++) {
      for (let j = i + 1; j < intervals.length; j++) {
        if (this.isOverlapping(intervals[i], intervals[j])) {
          return false;
        }
      }
    }
    return true;
  }

  private isOverlapping(
    interval1: CreateRateIntervalDto,
    interval2: CreateRateIntervalDto,
  ) {
    return interval1.de < interval2.ate && interval2.de < interval1.ate;
  }

  async create(createRateDto: CreateRateDto): Promise<RateEntity> {
    const {
      cod_concessionaria,
      dt_tarifa,
      intervalos_tarifas,
      subgrupo,
      valor,
    } = createRateDto;

    const concessionaire = await this.prismaService.concessionaria.findFirst({
      where: {
        cod_concessionaria,
      },
    });

    if (!concessionaire)
      throw new NotFoundException('Concessionária não foi encontrada');

    if (!this.areIntervalsValid(intervalos_tarifas))
      throw new BadRequestException('Os intervalos não podem se sobrepor');

    const sortedIntervals = this.prepareIntervals(valor, intervalos_tarifas);

    const rate = await this.prismaService.tarifa.create({
      data: {
        dt_tarifa,
        subgrupo,
        valor,
        concessionaria: {
          connect: {
            cod_concessionaria,
          },
        },
        intervalos_tarifas: {
          create: sortedIntervals,
        },
      },
      include: {
        intervalos_tarifas: true,
      },
    });

    return new RateEntity(rate);
  }

  async findOne(
    id: string,
    filters: {
      initTime?: number;
      finalTime?: number;
      value?: number;
    },
  ): Promise<RateEntity> {
    const { finalTime, initTime, value } = filters;

    const rate = await this.prismaService.tarifa.findFirst({
      where: {
        cod_tarifa: id,
        valor: value,
        intervalos_tarifas: {
          every: {
            de: initTime,
            ate: finalTime,
          },
        },
      },
      include: {
        intervalos_tarifas: true,
      },
    });

    if (!rate) throw new NotFoundException('Tarifa não foi encontrada');

    return new RateEntity(rate);
  }

  async update(id: string, updateRateDto: UpdateRateDto) {
    const {
      cod_concessionaria,
      dt_tarifa,
      valor,
      intervalos_tarifas,
      subgrupo,
    } = updateRateDto;

    const rate = await this.prismaService.tarifa.findFirst({
      where: {
        cod_tarifa: id,
      },
      include: { intervalos_tarifas: true },
    });

    if (!rate) throw new NotFoundException('Tarifa não foi encontrada');

    const concessionaire = await this.prismaService.concessionaria.findFirst({
      where: {
        cod_concessionaria,
      },
    });

    if (!concessionaire)
      throw new NotFoundException('Concessionária não foi encontrada');

    if (intervalos_tarifas && !this.areIntervalsValid(intervalos_tarifas))
      throw new BadRequestException('Os intervalos não podem se sobrepor');

    const newIntervals = this.prepareIntervals(valor, intervalos_tarifas);
    const currentIntervals = rate.intervalos_tarifas;

    const intervalsToDelete = currentIntervals.filter(
      (existingInterval) =>
        !newIntervals.some(
          (newInterval) =>
            'cod_intervalo_tarifa' in newInterval &&
            newInterval.cod_intervalo_tarifa ===
              existingInterval.cod_intervalo_tarifa,
        ),
    );

    const intervalsToUpdate = newIntervals.filter(
      (interval) => 'cod_intervalo_tarifa' in interval,
    ) as UpdateRateIntervalDto[];

    const intervalsToCreate = newIntervals.filter(
      (interval) => !('cod_intervalo_tarifa' in interval),
    ) as CreateRateIntervalDto[];

    const updatedRate = await this.prismaService.tarifa.update({
      where: {
        cod_tarifa: id,
      },
      data: {
        dt_tarifa,
        subgrupo,
        valor,
        concessionaria: {
          connect: {
            cod_concessionaria,
          },
        },
        intervalos_tarifas: {
          deleteMany: {
            cod_intervalo_tarifa: {
              in: intervalsToDelete.map(
                (interval) => interval.cod_intervalo_tarifa,
              ),
            },
          },
          create: intervalsToCreate,
          update: intervalsToUpdate.map((interval) => ({
            where: {
              cod_intervalo_tarifa: interval.cod_intervalo_tarifa,
            },
            data: interval,
          })),
        },
      },
      include: {
        intervalos_tarifas: true,
      },
    });

    return new RateEntity(updatedRate);
  }

  async remove(id: string): Promise<RateEntity> {
    const rate = await this.prismaService.tarifa.findFirst({
      where: {
        cod_tarifa: id,
      },
      include: {
        intervalos_tarifas: true,
      },
    });

    if (!rate) throw new NotFoundException('Tarifa não encontrada');

    await this.prismaService.tarifa.delete({
      where: {
        cod_tarifa: id,
      },
      include: {
        intervalos_tarifas: true,
      },
    });

    return new RateEntity(rate);
  }
}

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRateDto } from './dto/create-rate.dto';
import { UpdateRateDto } from './dto/update-rate.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RateEntity } from './entities/rate.entity';

@Injectable()
export class RatesService {
  constructor(private readonly prismaService: PrismaService) {}

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

    if (!intervalos_tarifas.length)
      throw new BadRequestException(
        'Pelo menos um Intervalo deve ser fornecido',
      );

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
          create: intervalos_tarifas,
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

    if (!rate) throw new NotFoundException('Tarifa não encontrada');

    return new RateEntity(rate);
  }

  update(id: number, updateRateDto: UpdateRateDto) {
    const {} = updateRateDto;
    return `This action updates a #${id} rate`;
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

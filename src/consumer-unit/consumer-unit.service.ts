import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateConsumerUnitDto } from './dto/create-consumer-unit.dto';
import { ConsumerUnitEntity } from './entities/consumer-unit.entity';
import { UpdateConsumerUnitDto } from './dto/update-consumer-unit.dto';
import { EquipmentEntity } from 'src/equipments/entities/equipment.entity';

@Injectable()
export class ConsumerUnitService {
  constructor(private readonly prismaService: PrismaService) {}

  async createConsumerUnit(
    createConsumerUnitDto: CreateConsumerUnitDto,
    userId: string,
  ) {
    const concessionaire = await this.prismaService.concessionaria.findUnique({
      where: {
        cod_concessionaria: createConsumerUnitDto.cod_concessionaria,
      },
    });

    if (!concessionaire) {
      throw new NotFoundException('Concessionária não encontrada');
    }

    const existingConsumerUnit =
      await this.prismaService.unidade_Consumidora.findFirst({
        where: {
          numero: createConsumerUnitDto.numero,
        },
      });

    if (existingConsumerUnit) {
      throw new ConflictException('Unidade consumidora já existe');
    }

    const consumerUnit = await this.prismaService.unidade_Consumidora.create({
      data: {
        cidade: createConsumerUnitDto.cidade,
        uf: createConsumerUnitDto.uf,
        numero: createConsumerUnitDto.numero,
        concessionaria: {
          connect: {
            cod_concessionaria: createConsumerUnitDto.cod_concessionaria,
          },
        },
        criador: {
          connect: {
            cod_usuario: userId,
          },
        },
      },
    });

    return new ConsumerUnitEntity(consumerUnit);
  }

  async findAllEquipments(id: string): Promise<EquipmentEntity[]> {
    const equipments = await this.prismaService.unidade_Consumidora.findMany({
      where: {
        cod_unidade_consumidora: id,
      },
    });

    return equipments.map((equipment) => new EquipmentEntity(equipment));
  }

  async updateConsumerUnit(
    updateConsumerUnitDto: UpdateConsumerUnitDto,
    consumerUnitId: string,
    userId: string,
  ) {
    const concessionaire = await this.prismaService.concessionaria.findUnique({
      where: {
        cod_concessionaria: updateConsumerUnitDto.cod_concessionaria,
      },
    });

    if (!concessionaire) {
      throw new NotFoundException('Concessionária não encontrada');
    }

    const consumerUnit = await this.prismaService.unidade_Consumidora.findFirst(
      {
        where: {
          cod_unidade_consumidora: consumerUnitId,
        },
      },
    );

    if (!consumerUnit) {
      throw new NotFoundException('Unidade consumidora não encontrada');
    }

    const updatedConsumerUnit =
      await this.prismaService.unidade_Consumidora.update({
        where: {
          cod_unidade_consumidora: consumerUnitId,
        },
        data: {
          cidade: updateConsumerUnitDto.cidade,
          uf: updateConsumerUnitDto.uf,
          concessionaria: {
            connect: {
              cod_concessionaria: updateConsumerUnitDto.cod_concessionaria,
            },
          },
          criador: {
            connect: {
              cod_usuario: userId,
            },
          },
        },
      });

    return new ConsumerUnitEntity(updatedConsumerUnit);
  }

  async findAllConsumerUnits(
    page: number,
    limit: number,
    filters: {
      uf: string;
      city: string;
      concessionaire: string;
    },
  ) {
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException(
        'Os parâmetros page/limit devem ser maiores que 0.',
      );
    }

    const whereCondition: {
      cidade?: {
        contains: string;
      };
      uf?: {
        contains: string;
      };
      cod_concessionaria?: string;
    } = {
      uf: {
        contains: filters.uf,
      },
      cidade: {
        contains: filters.city,
      },
      cod_concessionaria: filters.concessionaire,
    };

    const consumerUnits = await this.prismaService.unidade_Consumidora.findMany(
      {
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          criadoEm: 'desc',
        },
      },
    );

    const totalConsumerUnit =
      await this.prismaService.unidade_Consumidora.count({
        where: whereCondition,
      });

    const totalPages = Math.ceil(totalConsumerUnit / limit);

    return {
      limit,
      page,
      totalPages,
      consumerUnits: consumerUnits.map(
        (consumerUnits) => new ConsumerUnitEntity(consumerUnits),
      ),
      filters,
    };
  }

  async findOneConsumerUnit(consumerUnitId: string) {
    const consumerUnit = await this.prismaService.unidade_Consumidora.findFirst(
      {
        where: {
          cod_unidade_consumidora: consumerUnitId,
        },
      },
    );

    if (!consumerUnit) {
      throw new NotFoundException('Unidade consumidora não encontrada');
    }

    return new ConsumerUnitEntity(consumerUnit);
  }

  async deleteConsumerUnit(
    consumerUnitId: string,
    userId: string,
  ): Promise<ConsumerUnitEntity> {
    const consumerUnit = await this.prismaService.unidade_Consumidora
      .findFirstOrThrow({
        where: {
          cod_unidade_consumidora: consumerUnitId,
        },
      })
      .catch(() => {
        throw new NotFoundException('Unidade consumidora não encontrada');
      });

    if (consumerUnit.cod_usuario !== userId) {
      throw new UnauthorizedException(
        'Somente o usuário que criou a unidade consumidora pode deletá-la',
      );
    }

    await this.prismaService.unidade_Consumidora.delete({
      where: {
        cod_unidade_consumidora: consumerUnitId,
      },
    });

    return consumerUnit;
  }
}

import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateConsumerUnitDto } from './dto/create-consumer-unit.dto';
import { ConsumerUnitEntity } from './entities/consumer-unit.entity';
import { UpdateConsumerUnitDto } from './dto/update-consumer-unit.dto';
import { Fases, Subgrupo } from '@prisma/client';
import { ConnectConsumerUnitDto } from './dto/connect-consumer-unit.dto';
import { JWTType } from '../types/jwt.types';
import { EquipmentEntity } from '../equipments/entities/equipment.entity';
import { PrismaService } from '../prisma/prisma.service';

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

    if (
      (createConsumerUnitDto.subgrupo as string).startsWith('B') &&
      createConsumerUnitDto.optanteTB === false
    ) {
      throw new BadRequestException(
        "Subgrupo 'B' deve ser optante de tarifa branca",
      );
    }

    const consumerUnit = await this.prismaService.unidade_Consumidora.create({
      data: {
        cidade: createConsumerUnitDto.cidade,
        uf: createConsumerUnitDto.uf,
        numero: createConsumerUnitDto.numero,
        subgrupo: createConsumerUnitDto.subgrupo,
        optanteTB: createConsumerUnitDto.optanteTB,
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

  async findAllEquipments(
    id: string,
    page: number,
    limit: number,
    filters: {
      subgroup?: Subgrupo;
      city?: string;
      uf?: string;
      phase?: Fases;
      name?: string;
      mac?: string;
      unitNumber?: string;
    },
  ): Promise<{
    equipments: EquipmentEntity[];
    limit: number;
    page: number;
    totalPages: number;
    totalEquipments;
    filters: {
      city?: string;
      uf?: string;
      phase?: Fases;
      name?: string;
      mac?: string;
      unitNumber?: string;
    };
  }> {
    const { city, mac, name, phase, uf, unitNumber } = filters;

    const unit = await this.prismaService.unidade_Consumidora.findUnique({
      where: {
        cod_unidade_consumidora: id,
      },
    });

    if (!unit)
      throw new NotFoundException(
        `Unidade consumidora com id ${id} não foi encontrada`,
      );

    const equipments = await this.prismaService.equipamento.findMany({
      where: {
        cod_unidade_consumidora: id,
        cidade: city,
        uf,
        fases_monitoradas: phase,
        nome: name,
        mac,
        unidade_consumidora: {
          numero: unitNumber,
        },
      },
      include: {
        unidade_consumidora: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalEquipments = await this.prismaService.equipamento.count({
      where: {
        cod_unidade_consumidora: id,
      },
    });

    const totalPages = Math.ceil(totalEquipments / limit);

    return {
      equipments: equipments.map((equipment) => new EquipmentEntity(equipment)),
      limit,
      page,
      totalPages,
      totalEquipments,
      filters,
    };
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
          numero: updateConsumerUnitDto.numero,
          cidade: updateConsumerUnitDto.cidade,
          uf: updateConsumerUnitDto.uf,
          subgrupo: updateConsumerUnitDto.subgrupo,
          optanteTB: updateConsumerUnitDto.optanteTB,
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
    userId: string,
    page: number,
    limit: number,
    filters: {
      uf?: string;
      city?: string;
      concessionaire?: string;
      subgroup?: Subgrupo;
      query?: string;
    },
  ) {
    if (page <= 0 || limit <= 0) {
      throw new BadRequestException(
        'Os parâmetros page/limit devem ser maiores que 0.',
      );
    }

    let whereClause = {};

    if (
      filters.uf ||
      filters.city ||
      filters.concessionaire ||
      filters.subgroup
    ) {
      whereClause = {
        OR: [
          ...(filters.uf
            ? [
                {
                  uf: {
                    contains: filters.uf,
                    mode: 'insensitive',
                  },
                },
              ]
            : []),
          ...(filters.city
            ? [
                {
                  cidade: {
                    contains: filters.city,
                    mode: 'insensitive',
                  },
                },
              ]
            : []),
          ...(filters.concessionaire
            ? [
                {
                  concessionaria: {
                    cod_concessionaria: filters.concessionaire,
                  },
                },
              ]
            : []),
          ...(filters.subgroup
            ? [
                {
                  subgrupo: filters.subgroup,
                },
              ]
            : []),
        ],
      };
    }

    if (filters.query) {
      whereClause = {
        ...whereClause,
        OR: [
          {
            cidade: {
              contains: filters.query,
              mode: 'insensitive',
            },
          },
          {
            uf: {
              contains: filters.query,
              mode: 'insensitive',
            },
          },
          {
            numero: {
              contains: filters.query,
              mode: 'insensitive',
            },
          },
          {
            concessionaria: {
              nome: {
                contains: filters.query,
                mode: 'insensitive',
              },
            },
          },
        ],
      };
    }

    const user = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (user.perfil !== 'ADMIN') {
      whereClause = {
        ...whereClause,
        cod_usuario: userId,
      };
    }

    const consumerUnits = await this.prismaService.unidade_Consumidora.findMany(
      {
        where: whereClause,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          criadoEm: 'desc',
        },
        include: {
          concessionaria: true,
          equipamentos: true,
        },
      },
    );

    const totalConsumerUnits =
      await this.prismaService.unidade_Consumidora.count({
        where: whereClause,
      });

    const totalPages = Math.ceil(totalConsumerUnits / limit);

    return {
      limit,
      page,
      totalPages,
      totalConsumerUnits,
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
        include: {
          concessionaria: true,
          equipamentos: true,
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

    if (consumerUnit.cod_criador !== userId) {
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

  async addUnitToUser(
    req: JWTType,
    connectConsumerUnitDto: ConnectConsumerUnitDto,
  ): Promise<ConsumerUnitEntity> {
    const user = await this.prismaService.usuario.findUnique({
      where: { cod_usuario: req.user.userId }, // replace usuarioId with the actual ID you're using
    });

    if (!user) {
      throw new NotFoundException('Usuario não encontrado');
    }

    const { numero: unitNumber } = connectConsumerUnitDto;

    const validUnit = await this.prismaService.unidade_Consumidora.findUnique({
      where: {
        numero: String(unitNumber),
      },
    });

    if (!validUnit)
      throw new NotFoundException(`A Unidade Consumidora não foi encontrada`);

    if (validUnit.cod_usuario)
      throw new ConflictException(
        `A Unidade Consumidora já pertence a outro usuário`,
      );

    const consumerUnit = await this.prismaService.unidade_Consumidora.update({
      data: {
        usuario: {
          connect: {
            cod_usuario: user.cod_usuario,
          },
        },
      },
      where: {
        cod_unidade_consumidora: validUnit.cod_unidade_consumidora,
      },
    });

    return new ConsumerUnitEntity(consumerUnit);
  }
}

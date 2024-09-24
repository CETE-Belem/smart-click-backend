import { NotFoundException } from '@nestjs/common';
import { Intervalo_Tarifa, Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma/prisma.service';

export class EnergyService {
  conventional: number;
  rates: Intervalo_Tarifa[] | null;
  prisma: PrismaService;
  from: Date;
  to: Date;
  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async SetEquipment(equipmentId: string, from: Date, to: Date) {
    const unidadeConsumidora = await this.prisma.equipamento.findUnique({
      where: {
        cod_equipamento: equipmentId,
      },
      select: {
        unidade_consumidora: {
          select: {
            subgrupo: true, // Get the subgroup field
          },
        },
      },
    });

    // Extract the subgroup from unidade_consumidora
    const unidadeSubgroup = unidadeConsumidora?.unidade_consumidora?.subgrupo;

    if (!unidadeSubgroup) {
      throw new Error('Unidade consumidora or subgroup not found');
    }

    const equipment = await this.prisma.equipamento.findUnique({
      where: {
        cod_equipamento: equipmentId,
      },
      include: {
        unidade_consumidora: {
          include: {
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
      },
    });

    if (!equipment) {
      throw new NotFoundException('Equipamento não encontrado');
    }

    console.log(equipment.unidade_consumidora.concessionaria.tarifas);
  }
}

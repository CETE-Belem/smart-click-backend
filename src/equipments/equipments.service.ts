import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { AdminUpdateEquipmentDto } from './dto/admin-update-equipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EquipmentEntity } from './entities/equipment.entity';
import { JWTType } from 'src/types/jwt.types';
import { Cargo, Fases } from '@prisma/client';
import { UserUpdateEquipmentDto } from './dto/user-update-equipment.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class EquipmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    req: JWTType,
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<EquipmentEntity> {
    const {
      mac,
      name,
      description,
      numeroUnidadeConsumidora,
      cidade,
      tensaoNominal,
      uf,
      fases_monitoradas,
    } = createEquipmentDto;

    const { cod_unidade_consumidora } =
      await this.prismaService.unidade_Consumidora
        .findFirstOrThrow({
          where: {
            numero: numeroUnidadeConsumidora,
          },
        })
        .catch(() => {
          throw new NotFoundException('Unidade consumidora não encontrada');
        });

    const existingEquipment = await this.prismaService.equipamento.findFirst({
      where: {
        mac,
      },
    });

    if (existingEquipment)
      throw new ConflictException('Equipamento já cadastrado');

    const equipment = await this.prismaService.equipamento.create({
      data: {
        mac,
        cidade,
        uf,
        tensao_nominal: tensaoNominal,
        fases_monitoradas,
        nome: name,
        descricao: description,
        usuario_cadastrou: {
          connect: {
            cod_usuario: req.user.userId,
          },
        },
        unidade_consumidora: {
          connect: {
            cod_unidade_consumidora,
          },
        },
      },
    });

    return new EquipmentEntity(equipment);
  }

  async findAll(
    req: JWTType,
    options: {
      page: number;
      limit: number;
      query: string;
      cidade: string;
      uf: string;
      fase_monitorada: Fases;
    },
  ): Promise<{
    limit: number;
    page: number;
    totalPages: number;
    totalEquipments: number;
    equipments: EquipmentEntity[];
    filters: [
      {
        query: string;
        city: string;
        uf: string;
        fase_monitorada: Fases;
      },
    ];
  }> {
    const { limit, page, query, cidade, fase_monitorada, uf } = options;

    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: req.user.userId,
      },
    });
    if (usuario?.perfil !== Cargo.ADMIN) {
      const equipments = await this.prismaService.equipamento.findMany({
        where: {
          unidade_consumidora: {
            cod_usuario: req.user.userId,
          },
          OR: [
            {
              nome: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              mac: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              unidade_consumidora: {
                numero: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          ],
          cidade: {
            contains: cidade,
            mode: 'insensitive',
          },
          uf,
          fases_monitoradas: fase_monitorada,
        },
        orderBy: {
          criadoEm: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          unidade_consumidora: {
            include: {
              concessionaria: true,
            },
          },
        },
      });

      const totalEquipments = await this.prismaService.equipamento.count({
        where: {
          unidade_consumidora: {
            cod_usuario: req.user.userId,
          },
          OR: [
            {
              nome: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              mac: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              unidade_consumidora: {
                numero: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          ],
          cidade: {
            contains: cidade,
            mode: 'insensitive',
          },
          uf,
          fases_monitoradas: fase_monitorada,
        },
      });

      const totalPages = Math.ceil(totalEquipments / limit);

      return {
        limit,
        page,
        totalPages,
        totalEquipments,
        equipments: equipments.map(
          (equipment) => new EquipmentEntity(equipment),
        ),
        filters: [
          {
            query,
            city: cidade,
            uf,
            fase_monitorada,
          },
        ],
      };
    } else {
      const equipments = await this.prismaService.equipamento.findMany({
        where: {
          OR: [
            {
              nome: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              mac: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              unidade_consumidora: {
                numero: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          ],
          cidade: {
            contains: cidade,
            mode: 'insensitive',
          },
          uf,
          fases_monitoradas: fase_monitorada,
        },
        orderBy: {
          criadoEm: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          unidade_consumidora: {
            include: {
              concessionaria: true,
            },
          },
        },
      });

      const totalEquipments = await this.prismaService.equipamento.count({
        where: {
          OR: [
            {
              nome: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              mac: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              unidade_consumidora: {
                numero: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          ],
          cidade: {
            contains: cidade,
            mode: 'insensitive',
          },
          uf,
          fases_monitoradas: fase_monitorada,
        },
      });

      const totalPages = Math.ceil(totalEquipments / limit);

      return {
        limit,
        page,
        totalPages,
        totalEquipments,
        equipments: equipments.map(
          (equipment) => new EquipmentEntity(equipment),
        ),
        filters: [
          {
            query,
            city: cidade,
            uf,
            fase_monitorada,
          },
        ],
      };
    }
  }

  async generateReport(
    res: Response,
    id: string,
    filters: { from: Date; to: Date },
  ) {
    const { from, to } = filters;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    worksheet.columns = [
      { header: 'Data', key: 'date', width: 20 },
      { header: 'Corrente A', key: 'iA', width: 20 },
      { header: 'Corrente B', key: 'iB', width: 20 },
      { header: 'Corrente C', key: 'iC', width: 20 },
      { header: 'Tensão A', key: 'vA', width: 20 },
      { header: 'Tensão B', key: 'vB', width: 20 },
      { header: 'Tensão C', key: 'vC', width: 20 },
      { header: 'Potência Ativa A', key: 'activePowerA', width: 20 },
      { header: 'Potência Ativa B', key: 'activePowerB', width: 20 },
      { header: 'Potência Ativa C', key: 'activePowerC', width: 20 },
      { header: 'Potência Reativa A', key: 'reactivePowerA', width: 20 },
      { header: 'Potência Reativa B', key: 'reactivePowerB', width: 20 },
      { header: 'Potência Reativa C', key: 'reactivePowerC', width: 20 },
      { header: 'Potência Aparente A', key: 'apparentPowerA', width: 20 },
      { header: 'Potência Aparente B', key: 'apparentPowerB', width: 20 },
      { header: 'Potência Aparente C', key: 'apparentPowerC', width: 20 },
      { header: 'Fator de Potência A', key: 'powerFactorA', width: 20 },
      { header: 'Fator de Potência B', key: 'powerFactorB', width: 20 },
      { header: 'Fator de Potência C', key: 'powerFactorC', width: 20 },
    ];

    const equipmentData = await this.prismaService.equipamento.findFirst({
      where: {
        cod_equipamento: id,
        dados_sensor: {
          every: {
            criadoEm: {
              gte: from,
              lte: to,
            },
          },
        },
      },
      include: {
        dados_sensor: {
          orderBy: {
            criadoEm: 'asc',
          },
        },
      },
    });

    if (!equipmentData)
      throw new NotFoundException('Equipamento não encontrado');

    if (!equipmentData.dados_sensor)
      throw new NotFoundException('Dados do equipamento não encontrado');

    const calculateReactivePower = (
      apparentPower: number,
      activePower: number,
    ): number => {
      return Math.sqrt(
        Math.abs(Math.pow(apparentPower, 2) - Math.pow(activePower, 2)),
      );
    };

    const sheetData = equipmentData.dados_sensor.map((data) => ({
      date: data.criadoEm,
      iA: data.iA,
      iB: data.iB,
      iC: data.iC,
      vA: data.vA,
      vB: data.vB,
      vC: data.vC,
      activePowerA: data.potenciaAtivaA,
      activePowerB: data.potenciaAtivaB,
      activePowerC: data.potenciaAtivaC,
      reactivePowerA: calculateReactivePower(
        data.potenciaAparenteA,
        data.potenciaAtivaA,
      ),
      reactivePowerB: calculateReactivePower(
        data.potenciaAparenteB,
        data.potenciaAtivaB,
      ),
      reactivePowerC: calculateReactivePower(
        data.potenciaAparenteC,
        data.potenciaAtivaC,
      ),
      apparentPowerA: data.potenciaAparenteA,
      apparentPowerB: data.potenciaAparenteB,
      apparentPowerC: data.potenciaAparenteC,
      powerFactorA: data.FPA,
      powerFactorB: data.FPB,
      powerFactorC: data.FPC,
    }));

    worksheet.addRows(sheetData);

    const buffer = await workbook.xlsx.writeBuffer();

    const currDate = new Date()
      .toLocaleString('pt-BR')
      .trim()
      .split('/')
      .join('-')
      .split(', ')
      .join('_')
      .split(':')
      .join('-');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=equipamento${id}_${currDate}.xlsx`,
    );

    res.send(buffer);
  }

  async findOne(req: JWTType, id: string): Promise<EquipmentEntity> {
    const usuario = await this.prismaService.usuario.findUnique({
      where: {
        cod_usuario: req.user.userId,
      },
    });

    if (usuario.perfil === Cargo.ADMIN) {
      const equipment = await this.prismaService.equipamento.findUnique({
        where: {
          cod_equipamento: id,
        },
        include: {
          unidade_consumidora: {
            include: {
              concessionaria: true,
            },
          },
        },
      });

      if (!equipment) throw new NotFoundException('Equipamento não encontrado');

      return new EquipmentEntity(equipment);
    } else {
      const equipment = await this.prismaService.equipamento.findUnique({
        where: {
          cod_equipamento: id,
          unidade_consumidora: {
            cod_usuario: req.user.userId,
          },
        },
        include: {
          unidade_consumidora: {
            include: {
              concessionaria: true,
            },
          },
        },
      });

      if (!equipment)
        throw new NotFoundException(
          'Equipamento não encontrado ou não pertence ao usuário',
        );

      return new EquipmentEntity(equipment);
    }
  }

  async update(
    req: JWTType,
    id: string,
    updateEquipmentDto: UserUpdateEquipmentDto,
  ): Promise<EquipmentEntity> {
    const { description, name } = updateEquipmentDto;

    await this.prismaService.equipamento
      .findUniqueOrThrow({
        where: {
          cod_equipamento: id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Equipamento não encontrado');
      });

    const equipment = await this.prismaService.equipamento.update({
      where: {
        cod_equipamento: id,
      },
      data: {
        nome: name,
        descricao: description,
      },
      include: {
        unidade_consumidora: {
          include: {
            concessionaria: true,
          },
        },
      },
    });

    return new EquipmentEntity(equipment);
  }

  async adminUpdate(
    req: JWTType,
    id: string,
    updateEquipmentDto: AdminUpdateEquipmentDto,
  ): Promise<EquipmentEntity> {
    const {
      description,
      mac,
      name,
      numeroUnidadeConsumidora,
      cidade,
      fases_monitoradas,
      tensaoNominal,
      uf,
    } = updateEquipmentDto;

    const unidadeConsumidora = await this.prismaService.unidade_Consumidora
      .findFirstOrThrow({
        where: {
          numero: numeroUnidadeConsumidora,
        },
      })
      .catch(() => {
        throw new NotFoundException('Unidade consumidora não encontrada');
      });

    const cod_concessionaria = unidadeConsumidora.cod_concessionaria;

    await this.prismaService.equipamento
      .findUniqueOrThrow({
        where: {
          cod_equipamento: id,
          mac,
        },
      })
      .catch(() => {
        throw new NotFoundException('Equipamento não encontrado');
      });

    const equipment = await this.prismaService.equipamento.update({
      where: {
        cod_equipamento: id,
        mac,
      },
      data: {
        mac,
        nome: name,
        descricao: description,
        cidade,
        uf,
        fases_monitoradas,
        tensao_nominal: tensaoNominal,
        unidade_consumidora: {
          connect: {
            cod_unidade_consumidora: unidadeConsumidora.cod_unidade_consumidora,
          },
        },
      },
      include: {
        unidade_consumidora: {
          include: {
            concessionaria: true,
          },
        },
      },
    });

    return new EquipmentEntity(equipment);
  }

  async remove(req: JWTType, id: string): Promise<EquipmentEntity> {
    const equipment = await this.prismaService.equipamento.findUnique({
      where: {
        cod_equipamento: id,
      },
    });

    if (!equipment) throw new NotFoundException('Equipamento não encontrado');

    await this.prismaService.equipamento.delete({
      where: {
        cod_equipamento: id,
      },
    });

    return new EquipmentEntity(equipment);
  }

  async removeMany(req: JWTType, equipments: string[]): Promise<void> {
    const deletedEquipments = await this.prismaService.equipamento.deleteMany({
      where: {
        cod_equipamento: {
          in: equipments,
        },
        unidade_consumidora: {
          cod_usuario: req.user.userId,
        },
      },
    });

    if (deletedEquipments.count !== equipments.length)
      throw new NotFoundException('Alguns equipamentos não foram encontrados');

    return;
  }
}

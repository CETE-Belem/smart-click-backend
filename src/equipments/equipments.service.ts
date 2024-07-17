import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EquipmentEntity } from './entities/equipment.entity';
import { JWTType } from 'src/types/jwt.types';

@Injectable()
export class EquipmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    req: JWTType,
    createEquipmentDto: CreateEquipmentDto,
  ): Promise<EquipmentEntity> {
    const { mac, name, description, codConcessionaria } = createEquipmentDto;

    await this.prismaService.concessionaria
      .findFirstOrThrow({
        where: {
          cod_concessionaria: codConcessionaria,
        },
      })
      .catch(() => {
        throw new NotFoundException('Concessionária não encontrada');
      });

    const existingEquipment = await this.prismaService.equipamento.findFirst({
      where: {
        mac,
        cod_concessionaria: codConcessionaria,
      },
    });

    if (existingEquipment)
      throw new ConflictException('Equipamento já cadastrado');

    const equipment = await this.prismaService.equipamento.create({
      data: {
        mac,
        nome: name,
        descricao: description,
        concessionaria: {
          connect: {
            cod_concessionaria: codConcessionaria,
          },
        },
        usuario: {
          connect: {
            cod_usuario: req.user.userId,
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
      name: string;
      mac: string;
    },
  ): Promise<{
    limit: number;
    page: number;
    totalPages: number;
    equipments: EquipmentEntity[];
  }> {
    const { limit, page, mac, name } = options;

    const equipments = await this.prismaService.equipamento.findMany({
      where: {
        cod_usuario: req.user.userId,
        nome: {
          contains: name,
        },
        mac: {
          contains: mac,
        },
      },
      orderBy: {
        criadoEm: 'asc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalEquipments = await this.prismaService.equipamento.count({
      where: {
        cod_usuario: req.user.userId,
      },
    });

    const totalPages = Math.ceil(totalEquipments / limit);

    return {
      limit,
      page,
      totalPages,
      equipments: equipments.map((equipment) => new EquipmentEntity(equipment)),
    };
  }

  async findOne(req: JWTType, id: string): Promise<EquipmentEntity> {
    const equipment = await this.prismaService.equipamento.findUnique({
      where: {
        cod_equipamento: id,
        cod_usuario: req.user.userId,
      },
    });

    if (!equipment) throw new NotFoundException('Equipamento não encontrado');

    return new EquipmentEntity(equipment);
  }

  async update(
    req: JWTType,
    id: string,
    updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<EquipmentEntity> {
    const { codConcessionaria, description, mac, name } = updateEquipmentDto;

    await this.prismaService.concessionaria
      .findFirstOrThrow({
        where: {
          cod_concessionaria: codConcessionaria,
        },
      })
      .catch(() => {
        throw new NotFoundException('Concessionária não encontrada');
      });

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
        concessionaria: {
          connect: {
            cod_concessionaria: codConcessionaria,
          },
        },
      },
    });

    return new EquipmentEntity(equipment);
  }

  remove(id: number) {
    return `This action removes a #${id} equipment`;
  }
}

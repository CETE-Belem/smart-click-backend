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

  findAll() {
    return `This action returns all equipments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} equipment`;
  }

  update(id: number, updateEquipmentDto: UpdateEquipmentDto) {
    return `This action updates a #${id} equipment`;
  }

  remove(id: number) {
    return `This action removes a #${id} equipment`;
  }
}

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateConcessionaireDto } from './dto/create-concessionaire.dto';
import { UpdateConcessionaireDto } from './dto/update-concessionaire.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JWTType } from 'src/types/jwt.types';
import { ConcessionaireEntity } from './entities/concessionaire.entity';
import { RateEntity } from 'src/rates/entities/rate.entity';

@Injectable()
export class ConcessionaireService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    req: JWTType,
    createConcessionaireDto: CreateConcessionaireDto,
  ): Promise<ConcessionaireEntity> {
    const { userId } = req.user;
    const { city, name, uf } = createConcessionaireDto;

    const existingConcessionaire =
      await this.prismaService.concessionaria.findFirst({
        where: {
          cidade: city,
          nome: name,
          uf,
        },
      });

    if (existingConcessionaire)
      throw new ConflictException('Concessionária já cadastrada');

    const concessionaire = await this.prismaService.concessionaria.create({
      data: {
        cidade: city,
        nome: name,
        uf,
        criador: {
          connect: {
            cod_usuario: userId,
          },
        },
      },
    });

    return new ConcessionaireEntity(concessionaire);
  }

  async findAll(
    req: JWTType,
    options: {
      page: number;
      limit: number;
      name: string;
      uf: string;
      city: string;
    },
  ): Promise<{
    limit: number;
    page: number;
    totalPages: number;
    concessionaires: ConcessionaireEntity[];
  }> {
    const { city, limit, name, page, uf } = options;
    const concessionaires = await this.prismaService.concessionaria.findMany({
      where: {
        cidade: {
          contains: city,
        },
        nome: {
          contains: name,
        },
        uf: {
          contains: uf,
        },
      },
      orderBy: {
        criadoEm: 'asc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalConcessionaires = await this.prismaService.concessionaria.count({
      where: {
        cidade: {
          contains: city,
        },
        nome: {
          contains: name,
        },
        uf: {
          contains: uf,
        },
      },
    });

    const totalPages = Math.ceil(totalConcessionaires / limit);

    return {
      limit,
      page,
      totalPages,
      concessionaires: concessionaires.map(
        (concessionaire) => new ConcessionaireEntity(concessionaire),
      ),
    };
  }

  async findRates(
    id: string,
    page: number,
    limit: number,
    filters: {
      dates?: Date[];
      values?: number[];
    },
  ): Promise<{
    rates: RateEntity[];
    totalRates: number;
    limit: number;
    page: number;
    totalPages: number;
  }> {
    const concessionaire = await this.prismaService.concessionaria.findFirst({
      where: {
        cod_concessionaria: id,
      },
    });

    if (!concessionaire)
      throw new NotFoundException('Concessionária não encontrada');

    const { dates, values } = filters;

    const rates = await this.prismaService.tarifa.findMany({
      where: {
        cod_concessionaria: id,
        dt_tarifa: { in: dates },
        valor: { in: values },
      },
      include: {
        intervalos_tarifas: true,
      },
      orderBy: { dt_tarifa: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    });

    if (!rates.length) throw new NotFoundException('Nenhuma tarifa encontrada');

    const totalRates = await this.prismaService.tarifa.count({
      where: {
        cod_concessionaria: id,
        dt_tarifa: { in: dates },
        valor: { in: values },
      },
    });

    const totalPages = Math.ceil(totalRates / limit);

    return {
      rates: rates.map((rate) => new RateEntity(rate)),
      totalRates,
      limit,
      page,
      totalPages,
    };
  }

  async findOne(req: JWTType, id: string): Promise<ConcessionaireEntity> {
    const concessionaire = await this.prismaService.concessionaria
      .findUniqueOrThrow({
        where: {
          cod_concessionaria: id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Concessionária não encontrada');
      });

    return new ConcessionaireEntity(concessionaire);
  }

  async update(
    id: string,
    updateConcessionaireDto: UpdateConcessionaireDto,
  ): Promise<ConcessionaireEntity> {
    const { city, name, uf } = updateConcessionaireDto;

    await this.prismaService.concessionaria
      .findUniqueOrThrow({
        where: {
          cod_concessionaria: id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Concessionária não encontrada');
      });

    const updatedConcessionaire =
      await this.prismaService.concessionaria.update({
        where: {
          cod_concessionaria: id,
        },
        data: {
          nome: name,
          cidade: city,
          uf,
        },
      });

    return new ConcessionaireEntity(updatedConcessionaire);
  }

  async remove(req: JWTType, id: string): Promise<ConcessionaireEntity> {
    await this.prismaService.concessionaria
      .findUniqueOrThrow({
        where: {
          cod_concessionaria: id,
        },
      })
      .catch(() => {
        throw new NotFoundException('Concessionária não encontrada');
      });

    const concessionaire = await this.prismaService.concessionaria.delete({
      where: {
        cod_concessionaria: id,
      },
    });

    return new ConcessionaireEntity(concessionaire);
  }
}

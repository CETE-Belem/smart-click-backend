import { Equipamento, Fases, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxNameLength,
  macLength,
  maxDescriptionLength,
} from 'src/constants/equipment-fields';
import { ConsumerUnitEntity } from 'src/consumer-unit/entities/consumer-unit.entity';
import { ConcessionaireEntity } from 'src/concessionaire/entities/concessionaire.entity';
import { Transform } from 'class-transformer';

export class EquipmentEntity implements Equipamento {
  constructor(partial: Partial<EquipmentEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'O UUID da Concessionária',
    type: String,
    nullable: false,
  })
  cod_concessionaria: string;
  @ApiProperty({
    description: 'O UUID do Equipamento',
    type: String,
    nullable: false,
  })
  cod_equipamento: string;
  @ApiProperty({
    description: 'O UUID da Unidade Consumidora',
    type: String,
    nullable: false,
  })
  cod_unidade_consumidora: string;
  @ApiProperty({
    description: 'O UUID do Usuário',
    type: String,
    nullable: false,
  })
  cod_usuario: string;
  @ApiProperty({
    description: 'O Nome do Equipamento',
    maxLength: maxNameLength,
    type: String,
    nullable: false,
  })
  nome: string;
  @ApiProperty({
    description: 'A Descrição do Equipamento',
    maxLength: maxDescriptionLength,
    type: String,
    nullable: true,
  })
  descricao: string;
  @ApiProperty({
    description: 'O MAC Address do Equipamento',
    maxLength: macLength,
    type: String,
    nullable: false,
  })
  mac: string;
  @ApiProperty({
    description: 'A Data de Criação do Equipamento',
    type: Date,
    nullable: false,
    example: '2021-08-01T00:00:00.000Z',
  })
  criadoEm: Date;
  @ApiProperty({
    description: 'A Data de Atualização do Equipamento',
    type: Date,
    nullable: false,
    example: '2021-08-01T00:00:00.000Z',
  })
  atualizadoEm: Date;

  @ApiProperty({
    description: 'A Data de Atualização do Equipamento',
    type: Number,
    nullable: false,
    example: '220',
  })
  @Transform(({ value }) => value.toNumber())
  tensao_nominal: Prisma.Decimal;

  @ApiProperty({
    description: 'UF do Equipamento',
    type: String,
    nullable: false,
    example: 'PA',
  })
  uf: string;

  @ApiProperty({
    description: 'Cidade do Equipamento',
    type: String,
    nullable: false,
    example: 'Belém',
  })
  cidade: string;

  @ApiProperty({
    description: 'Fase do Equipamento',
    type: String,
    nullable: false,
    example: 'TRIFASE',
  })
  fases_monitoradas: Fases;

  @ApiProperty({
    description: 'Código do usuário que cadastrou o equipamento',
    type: String,
    nullable: false,
    example: 'f1b586b8-a86c-4d2d-83b6-d2e6fa5f2ba3',
  })
  cod_usuario_cadastrou: string;

  @ApiProperty({
    description: 'Unidade Consumidora do Equipamento',
    type: ConsumerUnitEntity,
    nullable: false,
  })
  unidade_consumidora: ConsumerUnitEntity;

  @ApiProperty({
    description: 'Con do Equipamento',
    type: ConcessionaireEntity,
    nullable: false,
  })
  concessionaria: ConcessionaireEntity;
}

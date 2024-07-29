import { Equipamento, Fases, Prisma } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxNameLength,
  macLength,
  maxDescriptionLength,
} from 'src/constants/equipment-fields';

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
    description: 'Subgrupo do Equipamento',
    type: String,
    nullable: false,
    example: 'A1',
  })
  subgrupo: string;

  @ApiProperty({
    description: 'Fase do Equipamento',
    type: String,
    nullable: false,
    example: 'TRIFASE',
  })
  fases_monitoradas: Fases;
}

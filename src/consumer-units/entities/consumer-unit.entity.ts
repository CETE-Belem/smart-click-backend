import { ApiProperty } from '@nestjs/swagger';
import { Subgrupo, Unidade_Consumidora } from '@prisma/client';

export class ConsumerUnitEntity implements Unidade_Consumidora {
  constructor(partial: Partial<ConsumerUnitEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    example: '80db693e-2831-4bbd-b322-1143c4ee603a',
    description: 'Código da unidade consumidora',
  })
  cod_unidade_consumidora: string;
  @ApiProperty({
    example: 'São Paulo',
    description: 'Nome da cidade',
  })
  cidade: string;
  @ApiProperty({
    example: 'SP',
    description: 'Sigla do estado',
  })
  uf: string;

  @ApiProperty({
    example: '80db693e-2831-4bbd-b322-1143c4ee603a',
    description: 'Código da concessionaria',
  })
  cod_concessionaria: string;

  @ApiProperty({
    example: '12345678',
    description: 'Código do criador',
    maxLength: 8,
    minLength: 8,
    nullable: false,
  })
  numero: string;

  @ApiProperty({
    example: '80db693e-2831-4bbd-b322-1143c4ee603a',
    description: 'Código do usuário',
  })
  cod_usuario: string;

  @ApiProperty({
    example: '80db693e-2831-4bbd-b322-1143c4ee603a',
    description: 'Código do criador',
  })
  cod_criador: string;

  @ApiProperty({
    example: '2021-08-20T00:00:00.000Z',
    description: 'Data de criação',
  })
  criadoEm: Date;
  @ApiProperty({
    example: '2021-08-20T00:00:00.000Z',
    description: 'Data de atualização',
  })
  atualizadoEm: Date;

  @ApiProperty({
    description: 'Subgrupo da unidade consumidora',
    type: String,
    nullable: false,
    example: 'B1',
  })
  subgrupo: Subgrupo;

  @ApiProperty({
    example: true,
    description: 'Optante TB',
  })
  optanteTB: boolean;
}

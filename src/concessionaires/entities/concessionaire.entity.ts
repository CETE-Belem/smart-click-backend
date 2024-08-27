import { Concessionaria } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  maxNameLength,
  maxCityLength,
  maxUFLength,
} from 'src/constants/concessionarie-fields';

export class ConcessionaireEntity implements Concessionaria {
  constructor(partial: Partial<ConcessionaireEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    nullable: false,
    example: 'dfc928b3-9998-4d43-a171-7e2814ce1334',
  })
  cod_concessionaria: string;
  @ApiProperty({
    nullable: false,
    maxLength: maxNameLength,
    example: 'Concessionária Teste',
  })
  nome: string;
  @ApiProperty({
    nullable: false,
    maxLength: maxCityLength,
    example: 'Cidade Teste',
  })
  cidade: string;
  @ApiProperty({
    nullable: false,
    maxLength: maxUFLength,
    example: 'UF',
  })
  uf: string;

  @ApiProperty({
    nullable: false,
    example: 'cod_criador',
  })
  cod_criador: string;
  @ApiProperty({
    nullable: false,
    example: new Date(),
  })
  atualizadoEm: Date;
  @ApiProperty({
    nullable: false,
    example: new Date(),
  })
  criadoEm: Date;
}

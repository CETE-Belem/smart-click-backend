import { Usuario } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { maxEmailLength, maxNameLength } from 'src/constants/user-fields';

export class UserEntity implements Usuario {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    type: String,
  })
  cod_perfil: string;
  @ApiProperty({
    type: String,
  })
  cod_usuario: string;
  @ApiProperty({
    type: String,
    example: 'João da Silva',
    maxLength: maxNameLength,
  })
  nome: string;
  @ApiProperty({
    type: String,
    example: 'john.doe@amazontech.com',
    maxLength: maxEmailLength,
  })
  email: string;
  @Exclude()
  senha: string;
  @Exclude()
  senhaSalt: string;

  @ApiProperty({
    type: Date,
    example: '2021-08-01T00:00:00.000Z',
  })
  criadoEm: Date;
  @ApiProperty({
    type: Date,
    example: '2021-08-01T00:00:00.000Z',
  })
  atualizadoEm: Date;
}

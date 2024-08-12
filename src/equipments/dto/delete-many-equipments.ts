import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class DeleteManyEquipmentsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @ApiProperty({
    type: [String],
    example: ['00000000-0000-0000-0000-000000000000'],
  })
  equipments: string[];
}

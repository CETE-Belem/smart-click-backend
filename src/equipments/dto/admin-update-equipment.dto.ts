import { PartialType } from '@nestjs/swagger';
import { CreateEquipmentDto } from './create-equipment.dto';

export class AdminUpdateEquipmentDto extends PartialType(CreateEquipmentDto) {}

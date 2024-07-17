import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JWTType } from 'src/types/jwt.types';
import { EquipmentEntity } from './entities/equipment.entity';

@ApiTags('equipments')
@UseGuards(AuthGuard)
@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: EquipmentEntity,
  })
  @ApiBody({ type: CreateEquipmentDto })
  @ApiBearerAuth('token')
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Concessionária não encontrada',
      },
    },
  })
  @ApiConflictResponse({
    status: HttpStatus.CONFLICT,
    schema: {
      example: {
        statusCode: HttpStatus.CONFLICT,
        message: 'Equipamento já cadastrado',
      },
    },
  })
  create(
    @Request() req: JWTType,
    @Body() createEquipmentDto: CreateEquipmentDto,
  ) {
    return this.equipmentsService.create(req, createEquipmentDto);
  }

  @Get()
  findAll() {
    return this.equipmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.equipmentsService.update(+id, updateEquipmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.equipmentsService.remove(+id);
  }
}

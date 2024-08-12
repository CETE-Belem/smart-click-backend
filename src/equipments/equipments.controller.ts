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
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JWTType } from 'src/types/jwt.types';
import { EquipmentEntity } from './entities/equipment.entity';
import { ParseFaseMonitoradaPipe } from 'src/common/pipes/ParseFaseMonitoradaPipe.pipe';
import { Fases, Subgrupo } from '@prisma/client';

@ApiTags('equipments')
@UseGuards(AuthGuard)
@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.CREATED,
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
  @ApiOkResponse({
    status: HttpStatus.OK,
    schema: {
      properties: {
        limit: {
          type: 'number',
        },
        page: {
          type: 'number',
        },
        totalPages: {
          type: 'number',
        },
        totalEquipments: {
          type: 'number',
        },
        equipments: {
          type: 'array',
          items: {
            type: 'object',
            $ref: getSchemaPath(EquipmentEntity),
          },
        },
      },
    },
  })
  @ApiBearerAuth('token')
  @ApiQuery({
    name: 'page',
    description: 'Página atual',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Quantidade de registros por página',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'mac',
    description: 'Mac do equipamento',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'name',
    description: 'Nome do equipamento',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'cidade',
    description: 'Cidade do equipamento',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'uf',
    description: 'UF do equipamento',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'fase_monitorada',
    description: 'Fase monitorada',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'subgrupo',
    description: 'Subgrupo',
    required: false,
    type: String,
  })
  findAll(
    @Request() req: JWTType,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
    @Query('mac') mac: string,
    @Query('name') name: string,
    @Query('cidade') cidade: string,
    @Query('uf') uf: string,
    @Query('fase_monitorada', ParseFaseMonitoradaPipe) fase_monitorada: Fases,
    @Query('subgrupo') subgrupo: Subgrupo,
  ) {
    return this.equipmentsService.findAll(req, {
      page,
      limit,
      mac,
      name,
      cidade,
      uf,
      fase_monitorada,
      subgrupo,
    });
  }

  @Get(':id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: EquipmentEntity,
  })
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
  @ApiParam({
    name: 'id',
    type: String,
  })
  findOne(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.equipmentsService.findOne(req, id);
  }

  @Patch(':id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: EquipmentEntity,
  })
  @ApiBody({ type: UpdateEquipmentDto })
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
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Equipamento não encontrado',
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  update(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.equipmentsService.update(req, id, updateEquipmentDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: EquipmentEntity,
  })
  @ApiBearerAuth('token')
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Equipamento não encontrado',
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
  })
  remove(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.equipmentsService.remove(req, id);
  }
}

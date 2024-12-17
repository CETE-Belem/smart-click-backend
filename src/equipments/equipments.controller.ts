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
  Put,
  Res,
} from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { AdminUpdateEquipmentDto } from './dto/admin-update-equipment.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JWTType } from '../types/jwt.types';
import { EquipmentEntity } from './entities/equipment.entity';
import { Fases } from '@prisma/client';
import { UserUpdateEquipmentDto } from './dto/user-update-equipment.dto';
import { Response } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ParseFaseMonitoradaPipe } from '../common/pipes/ParseFaseMonitoradaPipe.pipe';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('equipments')
@UseGuards(AuthGuard, RolesGuard)
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
  @Roles('ADMIN')
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
        filters: {
          type: 'array',
          items: {
            example: {
              query: 'Equipamento 01',
              city: 'Belém',
              uf: 'PA',
              fase_monitorada: 'MONOFASE',
            },
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
    name: 'query',
    description: 'Query de busca',
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
  findAll(
    @Request() req: JWTType,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
    @Query('query') query: string,
    @Query('cidade') cidade: string,
    @Query('uf') uf: string,
    @Query('fase_monitorada', ParseFaseMonitoradaPipe) fase_monitorada: Fases,
  ) {
    return this.equipmentsService.findAll(req, {
      page,
      limit,
      query,
      cidade,
      uf,
      fase_monitorada,
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

  @Get(':id/report')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({
    description:
      'Gera um relatório dos dados do equipamento referente ao id enviado',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Promise<void>,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    example: {
      message: 'Equipamento não encontrado',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiParam({ name: 'id', type: String, description: 'Id do equipamento' })
  @ApiQuery({
    name: 'from',
    type: String,
    description: 'Data inicial dos dados',
  })
  @ApiQuery({ name: 'to', type: String, description: 'Data final dos dados' })
  generateReport(
    @Res() res: Response,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.equipmentsService.generateReport(res, id, { from, to });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um equipamento como Usuário' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: EquipmentEntity,
  })
  @ApiBody({ type: UserUpdateEquipmentDto })
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
    @Body() updateEquipmentDto: UserUpdateEquipmentDto,
  ) {
    return this.equipmentsService.update(req, id, updateEquipmentDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualiza um equipamento como Admin' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: EquipmentEntity,
  })
  @ApiBody({ type: AdminUpdateEquipmentDto })
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
  adminUpdate(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateEquipmentDto: AdminUpdateEquipmentDto,
  ) {
    return this.equipmentsService.adminUpdate(req, id, updateEquipmentDto);
  }

  // @Delete()
  // @ApiOkResponse({
  //   status: HttpStatus.OK,
  // })
  // @ApiBearerAuth('token')
  // @ApiNotFoundResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   schema: {
  //     example: {
  //       statusCode: HttpStatus.NOT_FOUND,
  //       message: 'Um ou mais equipamentos não foram encontrados',
  //     },
  //   },
  // })
  // removeMany(
  //   @Request() req: JWTType,
  //   @Body() deleteManyEquipmentsDto: DeleteManyEquipmentsDto,
  // ) {
  //   return this.equipmentsService.removeMany(
  //     req,
  //     deleteManyEquipmentsDto.equipments,
  //   );
  // }

  @Delete(':id')
  @Roles('ADMIN')
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
  removeOne(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.equipmentsService.remove(req, id);
  }
}

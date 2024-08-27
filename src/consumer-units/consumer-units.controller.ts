import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Patch,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Get,
  Query,
  ParseIntPipe,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ConsumerUnitService } from './consumer-units.service';
import { CreateConsumerUnitDto } from './dto/create-consumer-unit.dto';
import {
  ApiCreatedResponse,
  ApiBody,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiParam,
  getSchemaPath,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JWTType } from 'src/types/jwt.types';
import { ConsumerUnitEntity } from './entities/consumer-unit.entity';
import { UpdateConsumerUnitDto } from './dto/update-consumer-unit.dto';
import { Fases, Subgrupo } from '@prisma/client';
import { EquipmentEntity } from 'src/equipments/entities/equipment.entity';

@ApiTags('consumer-units')
@Controller('consumer-units')
export class ConsumerUnitController {
  constructor(private readonly consumerUnitService: ConsumerUnitService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Lista de Unidade Consumidoras',
    schema: {
      properties: {
        consumerUnits: {
          type: 'array',
          items: {
            $ref: getSchemaPath(ConsumerUnitEntity),
          },
        },
        page: { type: 'number', example: 2 },
        limit: { type: 'number', example: 10 },
        totalPages: { type: 'number', example: 10 },
        filters: {
          type: 'array',
          items: {
            example: {
              city: 'Belém',
              uf: 'PA',
              concessionaire: '0b6cf373-ab3a-48fc-8288-b8d3e75a9fbd',
            },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    schema: {
      example: {
        message: 'Os parâmetros page/limit devem ser maiores que 0.',
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiParam({ name: 'city', type: 'string', required: false })
  @ApiParam({ name: 'uf', type: 'string', required: false })
  @ApiParam({
    name: 'concessionaire',
    type: 'string',
    required: false,
    description: 'Id da concessionária',
  })
  @ApiParam({ name: 'page', type: 'number', required: true })
  @ApiParam({ name: 'limit', type: 'number', required: true })
  findAll(
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
    @Query('city') city?: string,
    @Query('uf') uf?: string,
    @Query('concessionaire', new ParseUUIDPipe({ optional: true }))
    concessionaire?: string,
  ) {
    return this.consumerUnitService.findAllConsumerUnits(page, limit, {
      concessionaire,
      city,
      uf,
    });
  }

  @Get('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Dados de uma Unidade Consumidoras',
    type: ConsumerUnitEntity,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade consumidora não encontrada',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Unidade consumidora não encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.consumerUnitService.findOneConsumerUnit(id);
  }

  @Get(':id/equipments')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Equipamentos atrelados a uma Unidade Consumidora',
    type: [EquipmentEntity],
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade consumidora com id [:id] não foi encontrada',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message:
          'Unidade consumidora com id 421fd1c9-8382-4b65-b07a-3f94fe3768bd não foi encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    schema: {
      example: {
        message: 'Token não encontrado',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    required: true,
    description: 'Id da unidade consumidora',
  })
  @ApiParam({ name: 'page', type: 'number', required: true })
  @ApiParam({ name: 'limit', type: 'number', required: true })
  @ApiParam({ name: 'subgroup', type: 'Subgrupo', required: false })
  @ApiParam({ name: 'city', type: 'string', required: false })
  @ApiParam({ name: 'uf', type: 'string', required: false })
  @ApiParam({ name: 'phase', type: 'Fases', required: false })
  @ApiParam({ name: 'name', type: 'string', required: false })
  @ApiParam({ name: 'mac', type: 'string', required: false })
  @ApiParam({ name: 'unit_number', type: 'number', required: false })
  findAllEquipments(
    @Param('id') id: string,
    @Query(
      'page',
      new ParseIntPipe({
        exceptionFactory: () => {
          return new BadRequestException(
            'O parâmetro (page) deve existir e ser maior que 0.',
          );
        },
      }),
    )
    page: number,
    @Query(
      'limit',
      new ParseIntPipe({
        exceptionFactory: () => {
          return new BadRequestException(
            'O parâmetro (limit) deve existir e ser maior que 0.',
          );
        },
      }),
    )
    limit: number,
    @Query('subgroup') subgroup?: Subgrupo,
    @Query('city') city?: string,
    @Query('uf') uf?: string,
    @Query('phase') phase?: Fases,
    @Query('name') name?: string,
    @Query('mac') mac?: string,
    @Query('unit_number') unitNumber?: string,
  ) {
    return this.consumerUnitService.findAllEquipments(id, page, limit, {
      subgroup,
      city,
      uf,
      phase,
      name,
      mac,
      unitNumber,
    });
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiCreatedResponse({
    type: ConsumerUnitEntity,
  })
  @ApiBody({
    type: CreateConsumerUnitDto,
  })
  @ApiConflictResponse({
    description: 'Unidade consumidora já cadastrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiBearerAuth('token')
  async createConsumerUnit(
    @Body() createConsumerUnitDto: CreateConsumerUnitDto,
    @Request() req: JWTType,
  ) {
    return this.consumerUnitService.createConsumerUnit(
      createConsumerUnitDto,
      req.user.userId,
    );
  }

  @Patch('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Unidade consumidora atualizada',
    type: ConsumerUnitEntity,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade consumidora ou Concessionária não encontrada',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Unidade consumidora ou Concessionária não encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiBody({
    type: UpdateConsumerUnitDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiBearerAuth('token')
  async updateConsumerUnit(
    @Body() updateConsumerUnitDto: UpdateConsumerUnitDto,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Request() req: JWTType,
  ) {
    return this.consumerUnitService.updateConsumerUnit(
      updateConsumerUnitDto,
      id,
      req.user.userId,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Unidade consumidora deletada',
    type: ConsumerUnitEntity,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Unidade consumidora não encontrada',
    schema: {
      example: {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Unidade consumidora não encontrada',
        error: 'Not Found',
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Somente o usuário que criou a unidade consumidora pode deletá-la',
    schema: {
      example: {
        statusCode: HttpStatus.UNAUTHORIZED,
        message:
          'Somente o usuário que criou a unidade consumidora pode deletá-la',
        error: 'Unauthorized',
      },
    },
  })
  @ApiParam({ name: 'id', type: 'string' })
  async deleteConsumerUnit(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.consumerUnitService.deleteConsumerUnit(id, req.user.userId);
  }
}
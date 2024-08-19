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
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ConcessionaireService } from './concessionaire.service';
import { CreateConcessionaireDto } from './dto/create-concessionaire.dto';
import { UpdateConcessionaireDto } from './dto/update-concessionaire.dto';
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
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JWTType } from 'src/types/jwt.types';
import { ConcessionaireEntity } from './entities/concessionaire.entity';

@ApiTags('concessionaires')
@Controller('concessionaire')
export class ConcessionaireController {
  constructor(private readonly concessionaireService: ConcessionaireService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiCreatedResponse({
    type: ConcessionaireEntity,
  })
  @ApiBody({
    type: CreateConcessionaireDto,
  })
  @ApiConflictResponse({
    description: 'Concessionária já cadastrada',
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiBearerAuth('token')
  create(
    @Request() req: JWTType,
    @Body() createConcessionaireDto: CreateConcessionaireDto,
  ) {
    return this.concessionaireService.create(req, createConcessionaireDto);
  }

  @Get()
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: [ConcessionaireEntity],
    schema: {
      type: 'object',
      properties: {
        limit: { type: 'number' },
        page: { type: 'number' },
        totalPages: { type: 'number' },
        concessionaires: {
          type: 'array',
          items: {
            $ref: getSchemaPath(ConcessionaireEntity),
          },
        },
      },
    },
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'uf',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'city',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
  })
  findAll(
    @Request() req: JWTType,
    @Query('name') name: string,
    @Query('uf') uf: string,
    @Query('city') city: string,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
  ) {
    return this.concessionaireService.findAll(req, {
      name,
      uf,
      city,
      page,
      limit,
    });
  }

  @Get('/:id/consumer-unit')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiParam({ name: 'id', type: 'string', required: true })
  @ApiParam({ name: 'page', type: 'number', required: true })
  @ApiParam({ name: 'limit', type: 'number', required: true })
  @ApiParam({ name: 'city', type: 'string', required: false })
  @ApiParam({ name: 'uf', type: 'string', required: false })
  @ApiOkResponse({
    status: HttpStatus.OK,
    example: {
      consumerUnits: [
        {
          cod_unidade_consumidora: '421fd1c9-8382-4b65-b07a-3f94fe3768bd',
          cidade: 'Pietro de Nossa Senhora',
          uf: 'PI',
          numero: '85639330',
          criadoEm: '2024-08-18T16:35:58.129Z',
          atualizadoEm: '2024-08-18T16:35:58.129Z',
          cod_concessionaria: '08ca8920-2d02-4bfa-8b70-067b93ab75c6',
          cod_criador: '61e4c31b-8a1c-4adc-acfd-3fe0a6216496',
          cod_usuario: null,
        },
        {
          cod_unidade_consumidora: '4f465850-e06d-492c-a11a-c63931a38695',
          cidade: 'Moraes do Norte',
          uf: 'SE',
          numero: '20643782',
          criadoEm: '2024-08-18T16:35:58.156Z',
          atualizadoEm: '2024-08-18T16:35:58.156Z',
          cod_concessionaria: '08ca8920-2d02-4bfa-8b70-067b93ab75c6',
          cod_criador: '61e4c31b-8a1c-4adc-acfd-3fe0a6216496',
          cod_usuario: null,
        },
      ],
      limit: 20,
      page: 1,
      totalPages: 1,
      totalConsumerUnits: 2,
      filters: {},
    },
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autorizado',
    example: {
      message: 'Usuário não autorizado',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Concessionária de id [:id] não foi encontrada',
    example: {
      message:
        'Concessionária de id 08ca8920-2d02-4bfa-8b70-067b93ab75c6 não foi encontrada',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  findConsumerUnits(
    @Param('id') id: string,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
    @Query('city') city?: string,
    @Query('uf') uf?: string,
  ) {
    return this.concessionaireService.findConsumerUnits(id, page, limit, {
      city,
      uf,
    });
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOkResponse({
    type: ConcessionaireEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiNotFoundResponse({
    description: 'Concessionária não encontrada',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.concessionaireService.findOne(req, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiNotFoundResponse({
    description: 'Concessionária não encontrada',
  })
  @ApiOkResponse({
    type: ConcessionaireEntity,
  })
  @ApiBearerAuth('token')
  @ApiBody({
    type: UpdateConcessionaireDto,
  })
  update(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateConcessionaireDto: UpdateConcessionaireDto,
  ) {
    return this.concessionaireService.update(id, updateConcessionaireDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiUnauthorizedResponse({
    description: 'Usuário não autorizado',
  })
  @ApiNotFoundResponse({
    description: 'Concessionária não encontrada',
  })
  @ApiBearerAuth('token')
  @ApiOkResponse({
    description: 'Concessionária removida com sucesso',
    type: ConcessionaireEntity,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(
    @Request() req: JWTType,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    return this.concessionaireService.remove(req, id);
  }
}

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
  ParseArrayPipe,
  BadRequestException,
} from '@nestjs/common';
import { ConcessionaireService } from './concessionaires.service';
import { CreateConcessionaireDto } from './dto/create-concessionaire.dto';
import { UpdateConcessionaireDto } from './dto/update-concessionaire.dto';
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
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JWTType } from 'src/types/jwt.types';
import { ConcessionaireEntity } from './entities/concessionaire.entity';

@ApiTags('concessionaires')
@Controller('concessionaires')
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

  @Get(':id/rates')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Busca por todas as tarifas da concessionária correspondente ao id enviado, e as retorna',
  })
  @ApiOkResponse({
    example: {
      rates: [
        {
          cod_tarifa: 'a16038e5-6da4-4763-b719-274195cb4c90',
          dt_tarifa: '2021-08-20T00:00:00.000Z',
          valor: 10,
          subgrupo: 'A1',
          cod_concessionaria: '6628d9c1-ce5c-4f12-bd3b-5bcc2840abc8',
          criadoEm: '2024-09-04T21:24:15.950Z',
          atualizadoEm: '2024-09-04T21:24:15.948Z',
          intervalos_tarifas: [
            {
              cod_intervalo_tarifa: 'ecb79479-b8b9-4b06-9b1c-1b5e33f893d9',
              de: 0,
              ate: 7,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: 'a16038e5-6da4-4763-b719-274195cb4c90',
              criadoEm: '2024-09-04T21:24:15.950Z',
              atualizadoEm: '2024-09-04T21:24:15.950Z',
            },
            {
              cod_intervalo_tarifa: '1bc1040a-f370-4585-900e-6dc3abca5818',
              de: 7,
              ate: 123,
              valor: 10,
              tipo: 'INTERMEDIARIA',
              cod_tarifa: 'a16038e5-6da4-4763-b719-274195cb4c90',
              criadoEm: '2024-09-04T21:24:15.950Z',
              atualizadoEm: '2024-09-04T21:24:15.950Z',
            },
            {
              cod_intervalo_tarifa: '2aed232e-f2fe-420c-bf5a-e28f5d20d79e',
              de: 123,
              ate: 918,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: 'a16038e5-6da4-4763-b719-274195cb4c90',
              criadoEm: '2024-09-04T21:24:15.950Z',
              atualizadoEm: '2024-09-04T21:24:15.950Z',
            },
            {
              cod_intervalo_tarifa: 'ffcf965f-8260-4e0d-99eb-1e03c7b8ca7e',
              de: 918,
              ate: 1023,
              valor: 10,
              tipo: 'PONTA',
              cod_tarifa: 'a16038e5-6da4-4763-b719-274195cb4c90',
              criadoEm: '2024-09-04T21:24:15.950Z',
              atualizadoEm: '2024-09-04T21:24:15.950Z',
            },
            {
              cod_intervalo_tarifa: 'c3807705-55c6-493c-9d23-65c2102b2755',
              de: 1023,
              ate: 1440,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: 'a16038e5-6da4-4763-b719-274195cb4c90',
              criadoEm: '2024-09-04T21:24:15.950Z',
              atualizadoEm: '2024-09-04T21:24:15.950Z',
            },
          ],
        },
        {
          cod_tarifa: 'bef9fdc0-0162-47e1-ae92-fa47cfc5a8a5',
          dt_tarifa: '2021-08-20T00:00:00.000Z',
          valor: 10,
          subgrupo: 'A1',
          cod_concessionaria: '6628d9c1-ce5c-4f12-bd3b-5bcc2840abc8',
          criadoEm: '2024-09-04T21:24:15.142Z',
          atualizadoEm: '2024-09-04T21:24:15.141Z',
          intervalos_tarifas: [
            {
              cod_intervalo_tarifa: '5de75520-9e59-45a0-86fc-6d96d775e63c',
              de: 0,
              ate: 7,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: 'bef9fdc0-0162-47e1-ae92-fa47cfc5a8a5',
              criadoEm: '2024-09-04T21:24:15.142Z',
              atualizadoEm: '2024-09-04T21:24:15.142Z',
            },
            {
              cod_intervalo_tarifa: '63618755-2e79-4ca5-a5aa-67ad6b2002e1',
              de: 7,
              ate: 123,
              valor: 10,
              tipo: 'INTERMEDIARIA',
              cod_tarifa: 'bef9fdc0-0162-47e1-ae92-fa47cfc5a8a5',
              criadoEm: '2024-09-04T21:24:15.142Z',
              atualizadoEm: '2024-09-04T21:24:15.142Z',
            },
            {
              cod_intervalo_tarifa: '205ca5a1-b83f-41b2-9240-8d877ed3caee',
              de: 123,
              ate: 918,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: 'bef9fdc0-0162-47e1-ae92-fa47cfc5a8a5',
              criadoEm: '2024-09-04T21:24:15.142Z',
              atualizadoEm: '2024-09-04T21:24:15.142Z',
            },
            {
              cod_intervalo_tarifa: '21eca29c-56f5-42f5-9794-c93b17f72de2',
              de: 918,
              ate: 1023,
              valor: 10,
              tipo: 'PONTA',
              cod_tarifa: 'bef9fdc0-0162-47e1-ae92-fa47cfc5a8a5',
              criadoEm: '2024-09-04T21:24:15.142Z',
              atualizadoEm: '2024-09-04T21:24:15.142Z',
            },
            {
              cod_intervalo_tarifa: '957bab44-a30d-4d92-862a-ac7a46b30204',
              de: 1023,
              ate: 1440,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: 'bef9fdc0-0162-47e1-ae92-fa47cfc5a8a5',
              criadoEm: '2024-09-04T21:24:15.142Z',
              atualizadoEm: '2024-09-04T21:24:15.142Z',
            },
          ],
        },
        {
          cod_tarifa: '47544983-e475-4436-abf2-d2f1c0bae92a',
          dt_tarifa: '2021-08-20T00:00:00.000Z',
          valor: 10,
          subgrupo: 'A1',
          cod_concessionaria: '6628d9c1-ce5c-4f12-bd3b-5bcc2840abc8',
          criadoEm: '2024-09-04T21:24:14.199Z',
          atualizadoEm: '2024-09-04T21:24:14.197Z',
          intervalos_tarifas: [
            {
              cod_intervalo_tarifa: '56e9cb2e-d040-43d6-ac6d-173bbc75af20',
              de: 0,
              ate: 7,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: '47544983-e475-4436-abf2-d2f1c0bae92a',
              criadoEm: '2024-09-04T21:24:14.199Z',
              atualizadoEm: '2024-09-04T21:24:14.199Z',
            },
            {
              cod_intervalo_tarifa: 'b2828c67-5847-4b41-9ddc-ff63051b14b3',
              de: 7,
              ate: 123,
              valor: 10,
              tipo: 'INTERMEDIARIA',
              cod_tarifa: '47544983-e475-4436-abf2-d2f1c0bae92a',
              criadoEm: '2024-09-04T21:24:14.199Z',
              atualizadoEm: '2024-09-04T21:24:14.199Z',
            },
            {
              cod_intervalo_tarifa: '71a368c4-9799-46c3-84b2-e422ec232bff',
              de: 123,
              ate: 918,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: '47544983-e475-4436-abf2-d2f1c0bae92a',
              criadoEm: '2024-09-04T21:24:14.199Z',
              atualizadoEm: '2024-09-04T21:24:14.199Z',
            },
            {
              cod_intervalo_tarifa: 'c019fc4e-439c-4029-a658-c25d12d4b577',
              de: 918,
              ate: 1023,
              valor: 10,
              tipo: 'PONTA',
              cod_tarifa: '47544983-e475-4436-abf2-d2f1c0bae92a',
              criadoEm: '2024-09-04T21:24:14.199Z',
              atualizadoEm: '2024-09-04T21:24:14.199Z',
            },
            {
              cod_intervalo_tarifa: 'd801b654-2804-4a94-a68f-53d1cd898dcc',
              de: 1023,
              ate: 1440,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: '47544983-e475-4436-abf2-d2f1c0bae92a',
              criadoEm: '2024-09-04T21:24:14.199Z',
              atualizadoEm: '2024-09-04T21:24:14.199Z',
            },
          ],
        },
        {
          cod_tarifa: '82b8d881-8c82-4510-b634-cba4d8fcae93',
          dt_tarifa: '2021-08-20T00:00:00.000Z',
          valor: 10,
          subgrupo: 'A1',
          cod_concessionaria: '6628d9c1-ce5c-4f12-bd3b-5bcc2840abc8',
          criadoEm: '2024-09-04T21:24:12.900Z',
          atualizadoEm: '2024-09-04T21:24:12.898Z',
          intervalos_tarifas: [
            {
              cod_intervalo_tarifa: 'a5ae32c7-5a0b-4fbd-927e-020f238c9db3',
              de: 0,
              ate: 7,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: '82b8d881-8c82-4510-b634-cba4d8fcae93',
              criadoEm: '2024-09-04T21:24:12.900Z',
              atualizadoEm: '2024-09-04T21:24:12.900Z',
            },
            {
              cod_intervalo_tarifa: '99722163-ff3d-4896-a7e7-8a6182a2eec9',
              de: 7,
              ate: 123,
              valor: 10,
              tipo: 'INTERMEDIARIA',
              cod_tarifa: '82b8d881-8c82-4510-b634-cba4d8fcae93',
              criadoEm: '2024-09-04T21:24:12.900Z',
              atualizadoEm: '2024-09-04T21:24:12.900Z',
            },
            {
              cod_intervalo_tarifa: 'c73442a8-0edc-4e98-9fd6-339bea24a52d',
              de: 123,
              ate: 918,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: '82b8d881-8c82-4510-b634-cba4d8fcae93',
              criadoEm: '2024-09-04T21:24:12.900Z',
              atualizadoEm: '2024-09-04T21:24:12.900Z',
            },
            {
              cod_intervalo_tarifa: 'b642dee3-5fbb-49f8-a664-235d1afc81e6',
              de: 918,
              ate: 1023,
              valor: 10,
              tipo: 'PONTA',
              cod_tarifa: '82b8d881-8c82-4510-b634-cba4d8fcae93',
              criadoEm: '2024-09-04T21:24:12.900Z',
              atualizadoEm: '2024-09-04T21:24:12.900Z',
            },
            {
              cod_intervalo_tarifa: 'f8340d0d-497a-4bbd-9310-0197254f501d',
              de: 1023,
              ate: 1440,
              valor: 10,
              tipo: 'FORA_DE_PONTA',
              cod_tarifa: '82b8d881-8c82-4510-b634-cba4d8fcae93',
              criadoEm: '2024-09-04T21:24:12.900Z',
              atualizadoEm: '2024-09-04T21:24:12.900Z',
            },
          ],
        },
      ],
      totalRates: 4,
      limit: 400,
      page: 1,
      totalPages: 1,
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: 'Concessionária não encontrada',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  findRates(
    @Param('id') id: string,
    @Query('page', new ParseIntPipe()) page: number,
    @Query('limit', new ParseIntPipe()) limit: number,
    @Query(
      'dates',
      new ParseArrayPipe({ items: Date, separator: ',', optional: true }),
    )
    dates?: Date[],
    @Query(
      'values',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    values?: number[],
  ) {
    return this.concessionaireService.findRates(id, page, limit, {
      dates,
      values,
    });
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
    @Query('query') query?: string,
  ) {
    return this.concessionaireService.findAll(req, {
      page,
      limit,
      uf,
      name,
      city,
      query,
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
    @Query(
      'page',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException(
            'O parâmetro (page) deve existir e ser maior que 0.',
          ),
      }),
    )
    page: number,
    @Query(
      'limit',
      new ParseIntPipe({
        exceptionFactory: () =>
          new BadRequestException(
            'O parâmetro (limit) deve existir e ser maior que 0.',
          ),
      }),
    )
    limit: number,
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

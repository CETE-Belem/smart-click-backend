import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { RatesService } from './rates.service';
import { CreateRateDto } from './dto/create-rate.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateRateDto } from './dto/update-rate.dto';

@ApiTags('rates')
@Controller('rates')
export class RatesController {
  constructor(private readonly ratesService: RatesService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Cria uma nova tarifa, atrelada a uma concessionária, e a retorna',
  })
  @ApiCreatedResponse({
    example: {
      cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
      dt_tarifa: '2012-08-20T13:20:00.000Z',
      valor: 10,
      subgrupo: 'B1',
      cod_concessionaria: 'ee56ae6d-78f8-450a-9b00-8c345d34acbd',
      criadoEm: '2024-09-04T03:48:08.810Z',
      atualizadoEm: '2024-09-04T21:20:27.026Z',
      intervalos_tarifas: [
        {
          cod_intervalo_tarifa: '760787be-4e1a-416b-b932-f828389a37a3',
          de: 0,
          ate: 10,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:26.999Z',
          atualizadoEm: '2024-09-04T21:20:26.998Z',
        },
        {
          cod_intervalo_tarifa: '478b42cd-da4b-42b6-ba97-f0a9828f2a15',
          de: 10,
          ate: 100,
          valor: 10,
          tipo: 'PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.015Z',
          atualizadoEm: '2024-09-04T21:20:27.013Z',
        },
        {
          cod_intervalo_tarifa: '91f92f17-1fa2-474e-b6df-44133f808e57',
          de: 100,
          ate: 1440,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.020Z',
          atualizadoEm: '2024-09-04T21:20:27.019Z',
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Pelo menos um Intervalo deve ser fornecido',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: 'Concessionária não foi encontrada',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  create(@Body() createRateDto: CreateRateDto) {
    return this.ratesService.create(createRateDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'Retorna a tarifa correspondente ao id enviado' })
  @ApiOkResponse({
    example: {
      cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
      dt_tarifa: '2012-08-20T13:20:00.000Z',
      valor: 20,
      subgrupo: 'B1',
      cod_concessionaria: 'ee56ae6d-78f8-450a-9b00-8c345d34acbd',
      criadoEm: '2024-09-04T03:48:08.810Z',
      atualizadoEm: '2024-09-04T21:20:27.026Z',
      intervalos_tarifas: [
        {
          cod_intervalo_tarifa: '760787be-4e1a-416b-b932-f828389a37a3',
          de: 0,
          ate: 10,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:26.999Z',
          atualizadoEm: '2024-09-04T21:20:26.998Z',
        },
        {
          cod_intervalo_tarifa: '478b42cd-da4b-42b6-ba97-f0a9828f2a15',
          de: 10,
          ate: 100,
          valor: 20,
          tipo: 'PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.015Z',
          atualizadoEm: '2024-09-04T21:20:27.013Z',
        },
        {
          cod_intervalo_tarifa: '91f92f17-1fa2-474e-b6df-44133f808e57',
          de: 100,
          ate: 1440,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.020Z',
          atualizadoEm: '2024-09-04T21:20:27.019Z',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: 'Tarifa não encontrada',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  findOne(
    @Param('id') id: string,
    @Query('init_time', new ParseIntPipe({ optional: true })) initTime?: number,
    @Query('final_time', new ParseIntPipe({ optional: true }))
    finalTime?: number,
    @Query('value', new ParseFloatPipe({ optional: true })) value?: number,
  ) {
    return this.ratesService.findOne(id, { initTime, finalTime, value });
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary:
      'Atualiza a tarifa correspondente ao id, com base nos dados enviados, e retorna a tarifa',
    description:
      'Atualiza a tarifa correspondente ao id, com base nos dados enviados, e retorna a tarifa. Também possibilita alterações nos seus intervalos',
  })
  @ApiOkResponse({
    example: {
      cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
      dt_tarifa: '2012-08-20T13:20:00.000Z',
      valor: 10,
      subgrupo: 'B1',
      cod_concessionaria: 'ee56ae6d-78f8-450a-9b00-8c345d34acbd',
      criadoEm: '2024-09-04T03:48:08.810Z',
      atualizadoEm: '2024-09-04T21:20:27.026Z',
      intervalos_tarifas: [
        {
          cod_intervalo_tarifa: '760787be-4e1a-416b-b932-f828389a37a3',
          de: 0,
          ate: 10,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:26.999Z',
          atualizadoEm: '2024-09-04T21:20:26.998Z',
        },
        {
          cod_intervalo_tarifa: '478b42cd-da4b-42b6-ba97-f0a9828f2a15',
          de: 10,
          ate: 100,
          valor: 10,
          tipo: 'PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.015Z',
          atualizadoEm: '2024-09-04T21:20:27.013Z',
        },
        {
          cod_intervalo_tarifa: '91f92f17-1fa2-474e-b6df-44133f808e57',
          de: 100,
          ate: 1440,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.020Z',
          atualizadoEm: '2024-09-04T21:20:27.019Z',
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    example: {
      message: 'Os intervalos não podem se sobrepor',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: 'Tarifa não foi encontrada',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.ratesService.update(id, updateRateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('token')
  @ApiOperation({
    summary: 'Deleta a tarifa correspondente ao id enviado e retorna a tarifa',
  })
  @ApiOkResponse({
    example: {
      cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
      dt_tarifa: '2012-08-20T13:20:00.000Z',
      valor: 10,
      subgrupo: 'B1',
      cod_concessionaria: 'ee56ae6d-78f8-450a-9b00-8c345d34acbd',
      criadoEm: '2024-09-04T03:48:08.810Z',
      atualizadoEm: '2024-09-04T21:20:27.026Z',
      intervalos_tarifas: [
        {
          cod_intervalo_tarifa: '760787be-4e1a-416b-b932-f828389a37a3',
          de: 0,
          ate: 10,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:26.999Z',
          atualizadoEm: '2024-09-04T21:20:26.998Z',
        },
        {
          cod_intervalo_tarifa: '478b42cd-da4b-42b6-ba97-f0a9828f2a15',
          de: 10,
          ate: 100,
          valor: 10,
          tipo: 'PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.015Z',
          atualizadoEm: '2024-09-04T21:20:27.013Z',
        },
        {
          cod_intervalo_tarifa: '91f92f17-1fa2-474e-b6df-44133f808e57',
          de: 100,
          ate: 1440,
          valor: 10,
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a05b9b49-685b-4081-b07f-13e861c04e04',
          criadoEm: '2024-09-04T21:20:27.020Z',
          atualizadoEm: '2024-09-04T21:20:27.019Z',
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    example: {
      message: 'Tarifa não encontrada',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  remove(@Param('id') id: string) {
    return this.ratesService.remove(id);
  }
}

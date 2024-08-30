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
import { UpdateRateDto } from './dto/update-rate.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

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
  @ApiOkResponse({
    example: {
      cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
      dt_tarifa: '2024-02-29T00:00:00.000Z',
      valor: {
        s: 1,
        e: 1,
        d: [10],
      },
      subgrupo: 'A1',
      cod_concessionaria: '6628d9c1-ce5c-4f12-bd3b-5bcc2840abc8',
      intervalos_tarifas: [
        {
          cod_intervalo_tarifa: 'd53d2f76-b916-4369-a190-d1fc1ec5cc0d',
          de: 0,
          ate: 120,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
        },
        {
          cod_intervalo_tarifa: '6f4996cc-88a9-4362-9f12-1d3057aa1b4b',
          de: 120,
          ate: 240,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'INTERMEDIARIA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
        },
        {
          cod_intervalo_tarifa: '27c26fa7-54aa-4a76-a346-c475810aafa3',
          de: 120,
          ate: 121,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'PONTA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
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
      cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
      dt_tarifa: '2024-02-29T00:00:00.000Z',
      valor: {
        s: 1,
        e: 1,
        d: [10],
      },
      subgrupo: 'A1',
      cod_concessionaria: '6628d9c1-ce5c-4f12-bd3b-5bcc2840abc8',
      intervalos_tarifas: [
        {
          cod_intervalo_tarifa: 'd53d2f76-b916-4369-a190-d1fc1ec5cc0d',
          de: 0,
          ate: 120,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
        },
        {
          cod_intervalo_tarifa: '6f4996cc-88a9-4362-9f12-1d3057aa1b4b',
          de: 120,
          ate: 240,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'INTERMEDIARIA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
        },
        {
          cod_intervalo_tarifa: '27c26fa7-54aa-4a76-a346-c475810aafa3',
          de: 120,
          ate: 121,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'PONTA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
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
  update(@Param('id') id: string, @Body() updateRateDto: UpdateRateDto) {
    return this.ratesService.update(+id, updateRateDto);
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
      cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
      dt_tarifa: '2024-02-29T00:00:00.000Z',
      valor: {
        s: 1,
        e: 1,
        d: [10],
      },
      subgrupo: 'A1',
      cod_concessionaria: '6628d9c1-ce5c-4f12-bd3b-5bcc2840abc8',
      intervalos_tarifas: [
        {
          cod_intervalo_tarifa: 'd53d2f76-b916-4369-a190-d1fc1ec5cc0d',
          de: 0,
          ate: 120,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'FORA_DE_PONTA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
        },
        {
          cod_intervalo_tarifa: '6f4996cc-88a9-4362-9f12-1d3057aa1b4b',
          de: 120,
          ate: 240,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'INTERMEDIARIA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
        },
        {
          cod_intervalo_tarifa: '27c26fa7-54aa-4a76-a346-c475810aafa3',
          de: 120,
          ate: 121,
          valor: {
            s: 1,
            e: 1,
            d: [10],
          },
          tipo: 'PONTA',
          cod_tarifa: 'a562c693-8f97-4c7f-a8ba-ccae7ef82a0c',
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

import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { SensorDataService } from './sensor-datas.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SensorChartDataEntity } from './entities/sensor-chart-data.entity';

@ApiTags('sensor-data')
@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Get(':id/chart')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    description: 'id do equipamento',
    type: String,
    example: 'aa746b51-2c4f-4180-8b11-ba3a5fbb25cd',
    required: true,
  })
  @ApiParam({
    name: 'from',
    description: 'Data inicial',
    type: Date,
    example: '2021-09-01T00:00:00.000Z',
    required: true,
  })
  @ApiParam({
    name: 'to',
    description: 'Data final',
    example: '2021-09-01T23:59:59.999Z',
    type: Date,
    required: true,
  })
  @ApiOkResponse({
    description: 'Retorna os dados do equipamento',
    type: SensorChartDataEntity,
    isArray: true,
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
  getChartData(
    @Param('id') id: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.sensorDataService.getChartData(id, from, to);
  }

  @Get(':id/energy')
  @UseGuards(AuthGuard)
  @ApiParam({
    name: 'id',
    description: 'id do equipamento',
    type: String,
    example: 'aa746b51-2c4f-4180-8b11-ba3a5fbb25cd',
    required: true,
  })
  @ApiParam({
    name: 'from',
    description: 'Data inicial',
    type: Date,
    example: '2021-09-01T00:00:00.000Z',
    required: true,
  })
  @ApiParam({
    name: 'to',
    description: 'Data final',
    example: '2021-09-01T23:59:59.999Z',
    type: Date,
    required: true,
  })
  // @ApiOkResponse({
  //   description: 'Retorna os dados do equipamento',
  //   type: SensorChartDataEntity,
  //   isArray: true,
  // })
  // @ApiNotFoundResponse({
  //   status: HttpStatus.NOT_FOUND,
  //   schema: {
  //     example: {
  //       statusCode: HttpStatus.NOT_FOUND,
  //       message: 'Equipamento não encontrado',
  //     },
  //   },
  // })
  getEnergyData(
    @Param('id') id: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.sensorDataService.getEnergyConsumption(id, from, to);
  }
}

import { Controller, Get, Query, Param } from '@nestjs/common';
import { SensorDataService } from './sensor-datas.service';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}

  @Get(':id/chart')
  getChartData(
    @Param('id') id: string,
    @Query('from') from: Date,
    @Query('to') to: Date,
  ) {
    return this.sensorDataService.getChartData(id, from, to);
  }
}

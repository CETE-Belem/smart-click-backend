import { Controller } from '@nestjs/common';
import { SensorDataService } from './sensor-datas.service';

@Controller('sensor-data')
export class SensorDataController {
  constructor(private readonly sensorDataService: SensorDataService) {}
}

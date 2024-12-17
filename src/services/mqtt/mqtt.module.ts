import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WebSocketsModule } from '../../gateways/websocket.module';
import { MqttService } from './mqtt.service';
import { SensorDataService } from '../../sensor-datas/sensor-datas.service';
import { MailService } from '../../mail/mail.service';

@Module({
  providers: [MqttService, PrismaService, SensorDataService, MailService],
  exports: [MqttService],
  imports: [forwardRef(() => WebSocketsModule)],
})
export class MqttModule {}

import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebSocketsModule } from 'src/gateways/websocket.module';
import { MqttService } from './mqtt.service';
import { SensorDataService } from 'src/sensor-datas/sensor-datas.service';
import { MailService } from 'src/mail/mail.service';

@Module({
  providers: [MqttService, PrismaService, SensorDataService, MailService],
  exports: [MqttService],
  imports: [forwardRef(() => WebSocketsModule)],
})
export class MqttModule {}

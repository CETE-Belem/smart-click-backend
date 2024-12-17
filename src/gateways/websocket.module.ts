import { forwardRef, Module } from '@nestjs/common';
import { FrontWebSocketService } from './front-events/front-websocket.service';
import { FrontWebSocketGateway } from './front-events/front-websocket.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { MqttModule } from '../services/mqtt/mqtt.module';


@Module({
  imports: [forwardRef(() => MqttModule), PrismaModule],
  providers: [FrontWebSocketGateway, FrontWebSocketService],
  exports: [FrontWebSocketService],
})
export class WebSocketsModule {}

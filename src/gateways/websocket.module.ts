import { forwardRef, Module } from '@nestjs/common';
import { MqttModule } from 'src/services/mqtt/mqtt.module';
import { FrontWebSocketService } from './front-events/front-websocket.service';
import { FrontWebSocketGateway } from './front-events/front-websocket.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [forwardRef(() => MqttModule), PrismaModule],
  providers: [FrontWebSocketGateway, FrontWebSocketService],
  exports: [FrontWebSocketService],
})
export class WebSocketsModule {}

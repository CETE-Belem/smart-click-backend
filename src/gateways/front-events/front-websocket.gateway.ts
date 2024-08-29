import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { MqttService } from 'src/services/mqtt/mqtt.service';
import { FrontWebSocketService } from './front-websocket.service';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { env } from 'src/config/env.config';
import { SocketAuthMiddleware } from 'src/auth/ws.mw';

@WebSocketGateway({
  cors: {
    origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : '*',
  },
})
export class FrontWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Socket;

  constructor(
    private readonly frontWebSocketService: FrontWebSocketService,
    private readonly mqttService: MqttService,
    @Inject('winston') private logger: Logger,
  ) {}

  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
    this.logger.info('Websocket initialized');
  }

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return client.disconnect();
    this.logger.info(`User ${userId} connected to ws`);
    this.frontWebSocketService.associateSocketToUser(userId, client);
    await this.mqttService.subscribeToUserEquipments(userId);
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) return;
    this.frontWebSocketService.removeSocketFromUser(userId, client.id);
    await this.mqttService.unsubscribeToUserDevices(userId);
  }
}

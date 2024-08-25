import { Inject, Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { FrontWebSocketService } from 'src/gateways/front-events/front-websocket.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorDataService } from 'src/sensor-data/sensor-data.service';
import { Logger } from 'winston';

@Injectable()
export class MqttService {
  client: mqtt.MqttClient;
  connected = false;

  constructor(
    private frontWebSocketService: FrontWebSocketService,
    private prisma: PrismaService,
    private sensorDataService: SensorDataService,
    @Inject('winston') private logger: Logger,
  ) {
    this.client = mqtt.connect(
      `mqtt://${process.env.MQTT_URL}:${process.env.MQTT_PORT}`,
      {
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        clientId: process.env.MQTT_CLIENT_ID, // ID do cliente
      },
    );
    this.client.on('connect', async () => {
      this.connected = true;
      console.log('MQTT connected');
      this.logger.info('MQTT connected');
    });

    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message.toString()); // Tratar a mensagem recebida
    });

    this.client.on('error', (error) => {
      this.logger.error('MQTT error: ', error);
      console.error('MQTT error: ', error);
    });
  }

  publish(topic: string, message: string | Buffer, retain = false): boolean {
    if (!this.client.connected) {
      this.logger.error('MQTT not connected');
      console.error('MQTT not connected');
      return false;
    }
    this.client.publish(topic, message, { retain }, (err) => {
      if (err) {
        this.logger.error('MQTT publish error: ', err);
        console.error('MQTT publish error: ', err);
        return false;
      }
    });
    console.info('MQTT publish success');
    return true;
  }

  async handleMessage(topic: string, message: string) {
    const mac = topic.split('/')[0].replaceAll('-', ':');

    if (!mac.match(/([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})/)) {
      return;
    }

    if (topic.includes('/fafbfc')) {
      this.logger.info(
        `Received data from topic: ${topic} | message: ${message}`,
      );
      this.sensorDataService.handleData(message, mac);
      return;
    }

    const equipment = await this.prisma.equipamento.findUnique({
      where: {
        mac,
      },
    });
    const userId = equipment.cod_usuario;
    const sockets = this.frontWebSocketService.findSocketByUserId(userId);
    sockets.forEach((socket) => {
      socket.emit(
        topic.replaceAll('-', ':'),
        {
          mac,
          message,
        },
        (err) => console.log(err),
      );
    });
  }

  async subscribeToUserEquipments(userId: string) {
    const equipments = await this.prisma.equipamento.findMany({
      where: {
        usuario: {
          cod_usuario: userId,
        },
      },
      select: {
        mac: true,
      },
      distinct: ['mac'],
    });
    this.client.subscribe(
      equipments.map(
        (device) => `${device.mac.replaceAll(':', '-')}/smartclick/#`,
      ),
    );
  }

  async unsubscribeToUserDevices(userId: string) {
    const equipments = await this.prisma.equipamento.findMany({
      where: {
        usuario: {
          cod_usuario: userId,
        },
      },
      distinct: ['mac'],
    });
    this.client.unsubscribe(
      equipments.map(
        (device) => `${device.mac.replaceAll(':', '-')}/smartclick/#`,
      ),
      (error) => {
        error && this.logger.error('MQTT unsubscribe error: ', error);
      },
    );
  }

  async onModuleDestroy() {
    this.client.end();
  }
}

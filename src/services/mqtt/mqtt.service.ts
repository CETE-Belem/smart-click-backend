import { Inject, Injectable } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { FrontWebSocketService } from 'src/gateways/front-events/front-websocket.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SensorDataService } from 'src/sensor-datas/sensor-datas.service';
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
    this.client.on('connect', () => {
      this.connected = true;
      console.log('MQTT connected');
      this.logger.info('MQTT connected');

      this.client.subscribe('+/smartclick/fafbfc', (error) => {
        if (error) {
          console.error('MQTT subscribe error: ', error);
          this.logger.error('MQTT subscribe error: ', error);
        } else {
          console.log('MQTT subscribe success');
          this.logger.info('MQTT subscribe success');
        }
      });
    });

    this.client.on('message', (topic, message) => {
      console.log('Received message from topic: ', topic);
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
    try {
      const mac = topic.split('/')[0].replaceAll('-', ':');
      console.log('Received data from topic: ', topic, ' | message: ', message);
      console.log('MAC: ', mac);
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
          `${topic.replaceAll('-', ':')}`,
          {
            mac,
            data: Number(message),
          },
          (err) => console.log(err),
        );
      });
    } catch (error) {
      console.error('Error in handleMessage: ', error);
      this.logger.error('Error in handleMessage: ', error);
    }
  }

  async subscribeToUserEquipments(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        cod_usuario: userId,
      },
      select: {
        perfil: true,
        equipamentos: {
          select: {
            mac: true,
          },
        },
      },
    });
    if (!user) return;

    if (user.perfil === 'ADMIN') {
      this.client.subscribe('+/smartclick/#', (error) => {
        error && this.logger.error('MQTT subscribe error: ', error);
      });
      return;
    }

    const equipments = user.equipamentos;
    this.client.subscribe(
      equipments.map((device) => {
        console.log(
          'Subscribing to: ',
          `${device.mac.replaceAll(':', '-')}/smartclick/#`,
        );
        return `${device.mac.replaceAll(':', '-')}/smartclick/#`;
      }),
      (error) => {
        error && this.logger.error('MQTT subscribe error: ', error);
      },
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

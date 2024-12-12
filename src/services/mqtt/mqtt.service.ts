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
    this.client.setMaxListeners(20);
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
      this.logger.info('MQTT mensagem: ', message);
      //console.log('Received message from topic: ', topic);
      this.handleMessage(topic, message.toString()); // Tratar a mensagem recebida
    });

    this.client.on('error', (error) => {
      this.logger.error('MQTT mensagem: ', error);
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
      if (!mac.match(/([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})/)) {
        return;
      }

      if (topic.includes('/fafbfc')) {
        // this.logger.info(
        //   `Received data from topic: ${topic} | message: ${message}`,
        // );
        this.sensorDataService.handleData(message, mac);
        return;
      }

      const equipment = await this.prisma.equipamento.findUnique({
        where: {
          mac,
        },
        include: {
          unidade_consumidora: true,
        },
      });
      const userId = equipment.unidade_consumidora.cod_usuario;
      const sockets = this.frontWebSocketService.findSocketByUserId(userId);
      sockets?.forEach((socket) => {
        socket.emit(
          `${topic.replaceAll('-', ':')}`,
          {
            mac,
            data: Number(message),
          },
          (err) => console.log(err),
        );
      });
      const adminUsersId = await this.prisma.usuario.findMany({
        where: {
          perfil: 'ADMIN',
        },
        select: {
          cod_usuario: true,
        },
      });
      const adminSockets = adminUsersId.map((admin) =>
        this.frontWebSocketService.findSocketByUserId(admin.cod_usuario),
      );
      adminSockets?.forEach((sockets) => {
        sockets?.forEach((socket) => {
          socket.emit(
            `${topic.replaceAll('-', ':')}`,
            {
              mac,
              data: Number(message),
            },
            (err) => console.log(err),
          );
        });
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
        unidades_consumidoras: {
          include: {
            equipamentos: {
              select: {
                mac: true,
              },
            },
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

    const equipments = user.unidades_consumidoras.flatMap(
      (e) => e.equipamentos,
    );
    if (!equipments) return;
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
        unidade_consumidora: {
          cod_usuario: userId,
        },
      },
      distinct: ['mac'],
    });
    this.client.unsubscribe(
      equipments.flatMap((device) => {
        const baseTopic = `${device.mac.replaceAll(':', '-')}/smartclick/`;
        const unsubscribePaths = [
          'last_will',
          'tfa',
          'tfb',
          'tfc',
          'cfa',
          'cfb',
          'cfc',
          'prfa',
          'prfb',
          'prfc',
          'pafa',
          'pafb',
          'pafc',
        ];
        return unsubscribePaths.map((path) => `${baseTopic}${path}`);
      }),
      (error) => {
        error && this.logger.error('MQTT unsubscribe error: ', error);
      },
    );
  }

  async sendGetConstants(id: string): Promise<{ [key: string]: string }> {
    const equipment = await this.prisma.equipamento.findUnique({
      where: {
        cod_equipamento: id,
      },
      select: {
        mac: true,
      },
    });

    if (!equipment) return;

    const baseTopic = `${equipment.mac.replaceAll(':', '-')}/smartclick/`;
    const subscribePaths = ['ctfa', 'ctfb', 'ctfc', 'ccfa', 'ccfb', 'ccfc'];
    const arraySubscribePaths = subscribePaths.map(
      (path) => `${baseTopic}${path}`,
    );

    const result: { [key: string]: string } = await new Promise(
      (resolve, reject) => {
        const receivedMessages: { [key: string]: string } = {};

        // Adiciona um único listener para todas as mensagens
        const messageHandler = (receivedTopic: string, message: Buffer) => {
          // Verifica se o tópico recebido está nos tópicos assinados
          const matchedPath = subscribePaths.find((path) =>
            receivedTopic.endsWith(path),
          );

          if (matchedPath) {
            // Armazena a mensagem usando a última parte do tópico (e.g. 'ctfa') como chave
            receivedMessages[matchedPath] = message.toString();

            // Verifica se já recebemos todas as mensagens esperadas
            if (
              Object.keys(receivedMessages).length === subscribePaths.length
            ) {
              this.client.removeListener('message', messageHandler); // Remove o listener após todas as mensagens serem recebidas
              resolve(receivedMessages); // Retorna todas as mensagens como um objeto
            }
          }
        };

        this.client.on('message', messageHandler);

        // Inscreve-se nos tópicos
        this.client.subscribe(arraySubscribePaths, (error) => {
          if (error) {
            this.logger.error('MQTT subscribe error: ', error);
            this.client.removeListener('message', messageHandler); // Remove o listener em caso de erro
            return reject(error);
          }
        });
      },
    );

    this.client.unsubscribe(arraySubscribePaths, (error) => {
      if (error) {
        this.logger.error('MQTT unsubscribe error: ', error);
      }
    });

    return result;
  }

  async onModuleDestroy() {
    this.client.end();
  }
}

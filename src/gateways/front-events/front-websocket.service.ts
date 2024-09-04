import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class FrontWebSocketService {
  private userSockets: { [key: string]: Socket[] } = {};

  associateSocketToUser(userId: string, socket: Socket): void {
    if (!this.userSockets[userId]) {
      this.userSockets[userId] = [];
    }
    this.userSockets[userId].push(socket);
  }

  findSocketByUserId(userId: string): Socket[] {
    return this.userSockets[userId];
  }

  removeSocketFromUser(userId: string, clientId: string): void {
    if (this.userSockets[userId]) {
      this.userSockets[userId] = this.userSockets[userId].filter(
        (socket) => socket.id !== clientId,
      );
      if (this.userSockets[userId].length === 0)
        delete this.userSockets[userId];
    }
  }
}

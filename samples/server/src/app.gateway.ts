import { WebNeekLogger } from './utils/webneek-logger';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ActionTypes, FormData } from '@webneek/rtc-data';

@WebSocketGateway()
export class AppGateway {
  connectedClients = [];

  data = {};

  @WebSocketServer()
  server: Server;

  private logger: WebNeekLogger = new WebNeekLogger('EventsGateway');

  handleConnection(client: Socket) {
    this.connectedClients = [...this.connectedClients, client.id];
    this.logger.connected(client.id, this.connectedClients.length);
    this.server.emit(ActionTypes.ClientConnected, this.connectedClients);
    client.emit(ActionTypes.Data, this.data);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients = this.connectedClients.filter(
      (connectedClient) => connectedClient !== client.id
    );
    this.logger.disconnected(client.id, this.connectedClients.length);
    this.server.emit(ActionTypes.ClientConnected, this.connectedClients);
  }

  @SubscribeMessage(ActionTypes.PatchValue)
  patchValue(client: Socket, payload: Partial<FormData>) {
    this.data = { ...this.data, ...payload };
    this.logger.log(`Patch value: ${JSON.stringify(payload)}.`);
    client.broadcast.emit(ActionTypes.ValuePatched, payload);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}

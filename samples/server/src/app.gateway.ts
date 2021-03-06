import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebneekLogger } from './utils/webneek-logger';
import { ActionTypes, FormData } from '@nx-state/store';

@WebSocketGateway()
export class AppGateway {
  connectedClients = [];

  data = {};

  @WebSocketServer()
  server: Server;

  private logger: WebneekLogger = new WebneekLogger('WebneekGateway');

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

  @SubscribeMessage('offer')
  offer(client: Socket, payload: Partial<FormData>) {
    this.data = { ...this.data, ...payload };
    this.logger.log(`offer: ${JSON.stringify(payload)}.`);
    client.broadcast.emit('offer', payload);
  }

  @SubscribeMessage('answer')
  answer(client: Socket, payload: Partial<FormData>) {
    this.data = { ...this.data, ...payload };
    this.logger.log(`answer: ${JSON.stringify(payload)}.`);
    client.broadcast.emit('answer', payload);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}

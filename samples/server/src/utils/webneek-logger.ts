import { Injectable, Logger, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.DEFAULT })
export class WebNeekLogger extends Logger {
  log(message: string, context?: string) {
    super.log(message, context ? context : 'App');
  }

  error(message: string, trace: string) {
    // add your tailored logic here
    super.error(message, trace);
  }

  connected(id: string, total: number) {
    super.log(`Client connected: ${id} - ${total} connected clients.`);
  }

  disconnected(id: string, total: number) {
    super.log(`Client disconnected: ${id} - ${total} connected clients.`);
  }
}

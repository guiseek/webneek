/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { WebNeekLogger } from './utils/webneek-logger';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  app.useLogger(app.get(WebNeekLogger));
  app.useWebSocketAdapter(new WsAdapter(app));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    WebNeekLogger.log(
      'Listening at http://localhost:' + port + '/' + globalPrefix,
      'App'
    );
  });
}

bootstrap();

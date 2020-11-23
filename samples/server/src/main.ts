import { WebneekLogger } from './utils/webneek-logger';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });
  const config = app.get(ConfigService);
  app.useLogger(app.get(WebneekLogger));

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    const host = `http://localhost:${port}/${globalPrefix}`;
    const env = ` ${config.get('environment')} mode`;
    WebneekLogger.log(`Listening at ${host} on ${env} on`, 'Webneek Server');
  });
}

bootstrap();

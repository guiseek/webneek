import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { WebNeekLogger } from './utils/webneek-logger';
import { ServerCoreModule } from '@webneek/server-core';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';

@Module({
  imports: [ServerCoreModule],
  controllers: [AppController],
  providers: [WebNeekLogger, AppService, AppGateway],
})
export class AppModule {}

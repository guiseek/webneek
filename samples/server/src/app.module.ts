import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { WebneekLogger } from './utils/webneek-logger';
import { ServerCoreModule } from '@webneek/server-core';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';

@Module({
  imports: [ServerCoreModule],
  controllers: [AppController],
  providers: [WebneekLogger, AppService, AppGateway],
})
export class AppModule {}

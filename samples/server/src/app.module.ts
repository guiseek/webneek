import { Module } from '@nestjs/common';
import { ServerCoreModule } from '@webneek/server-core';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WebneekLogger } from './utils/webneek-logger';
@Module({
  imports: [
    ServerCoreModule,
    UserModule,
    MongooseModule.forRoot(process.env.MONGO_URI, {
      useNewUrlParser: true,
    }),
  ],
  controllers: [AppController],
  providers: [WebneekLogger, AppService, AppGateway],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { WebNeekLogger } from './utils/webneek-logger';

@Module({
  imports: [EventsModule],
  providers: [WebNeekLogger]
})
export class AppModule {}

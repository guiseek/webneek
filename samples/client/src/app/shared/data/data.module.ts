import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WebSocketConfig,
  WebSocketFacade,
  WebSocketFactory,
  SOCKET_CONFIG_TOKEN,
} from './web-socket.facade';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class DataModule {
  static forRoot(config: WebSocketConfig): ModuleWithProviders<DataModule> {
    return {
      ngModule: DataModule,
      providers: [
        { provide: SOCKET_CONFIG_TOKEN, useValue: config ?? {} },
        {
          provide: WebSocketFacade,
          useFactory: WebSocketFactory,
          deps: [SOCKET_CONFIG_TOKEN],
        },
      ],
    };
  }
}

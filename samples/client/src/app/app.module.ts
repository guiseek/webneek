import { WebAudioModule } from '@webneek/media';
import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AudioComponent } from './audio/audio.component';
import { VideoComponent } from './video/video.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RtcSocket } from './video/rtc-socket';
import { RtcSocketConfig } from './video/rtc-socket.config';

/** Socket factory */
export function SocketFactory(config: RtcSocketConfig) {
  return new RtcSocket(config);
}

export const SOCKET_CONFIG_TOKEN = new InjectionToken<RtcSocketConfig>(
  '__SOCKET_IO_CONFIG__'
);

const config: RtcSocketConfig = {
  url: 'http://localhost:3333',
  options: {
    // protocols
  },
};

@NgModule({
  declarations: [AppComponent, AudioComponent, VideoComponent],
  imports: [
    BrowserModule,
    WebAudioModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      [
        { path: 'audio', component: AudioComponent },
        { path: 'video', component: VideoComponent },
      ],
      {
        initialNavigation: 'enabled',
      }
    ),
  ],
  providers: [
    RtcSocket,
    { provide: SOCKET_CONFIG_TOKEN, useValue: config },
    {
      provide: RtcSocket,
      useFactory: SocketFactory,
      deps: [SOCKET_CONFIG_TOKEN],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { WebAudioModule } from '@webneek/media';
import { BrowserModule } from '@angular/platform-browser';
import { InjectionToken, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AudioComponent } from './audio/audio.component';
import { VideoComponent } from './video/video.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataModule, WebSocketConfig } from './shared/data';

const config: WebSocketConfig = {
  // url: 'http://localhost:3000',
  url: 'https://webneek-server.herokuapp.com',
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
    DataModule.forRoot(config),
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
  bootstrap: [AppComponent],
})
export class AppModule {}

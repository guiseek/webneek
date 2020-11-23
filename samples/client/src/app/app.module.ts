import { BrowserModule } from '@angular/platform-browser';
import { WebAudioModule } from '@webneek/media';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AudioComponent } from './audio/audio.component';
import { VideoComponent } from './video/video.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataModule, WebSocketConfig } from './shared/data';
import { HelpdeskComponent } from './helpdesk/helpdesk.component';
import { HomeComponent } from './home/home.component';
import { BannerComponent } from './shared/components/banner/banner.component';

const config: WebSocketConfig = {
  // url: 'http://localhost:3000',
  url: 'https://webneek-server.herokuapp.com',
  options: {},
};

@NgModule({
  declarations: [
    AppComponent,
    AudioComponent,
    VideoComponent,
    HelpdeskComponent,
    BannerComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    WebAudioModule,
    ReactiveFormsModule,
    DataModule.forRoot(config),
    RouterModule.forRoot(
      [
        { path: '', component: HomeComponent },
        { path: 'audio', component: AudioComponent },
        { path: 'video', component: VideoComponent },
        { path: 'help', component: HelpdeskComponent },
        // { path: '', redirectTo: 'help', pathMatch: 'full' }
      ],
      {
        initialNavigation: 'enabled',
      }
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

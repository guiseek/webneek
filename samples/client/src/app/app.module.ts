import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { WebAudioModule } from '@webneek/media';
import { UiPopoverModule } from '@webneek/ui-popover';
import { webSocketConfig } from './../environments/environment';
import { HelpdeskComponent } from './helpdesk/helpdesk.component';
import { BannerComponent } from './shared/components/banner';
import { AudioComponent } from './audio/audio.component';
import { VideoComponent } from './video/video.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { DataModule } from './shared/data';

const childrenDemos = () =>
  import('./demos/demos.module').then((m) => m.DemosModule);

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
    UiPopoverModule,
    ReactiveFormsModule,
    DataModule.forRoot(webSocketConfig),
    RouterModule.forRoot(
      [
        { path: '', component: HomeComponent },
        { path: 'audio', component: AudioComponent },
        { path: 'video', component: VideoComponent },
        { path: 'help', component: HelpdeskComponent },
        { path: 'demos', loadChildren: childrenDemos },
      ],
      {
        initialNavigation: 'enabled',
      }
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

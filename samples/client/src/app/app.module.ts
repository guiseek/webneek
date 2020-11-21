import { WebAudioModule } from '@webneek/media';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AudioComponent } from './audio/audio.component';

@NgModule({
  declarations: [AppComponent, AudioComponent],
  imports: [
    BrowserModule,
    WebAudioModule,
    RouterModule.forRoot([{ path: 'audio', component: AudioComponent }], {
      initialNavigation: 'enabled',
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

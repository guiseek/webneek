import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  constructor() {}

  share(): Promise<MediaStream> {
    const nav = <any>window.navigator;
    console.log(nav.mediaDevices.enumerateDevices);
    if (nav.getDisplayMedia) {
      return nav.getDisplayMedia({ video: true });
    } else if (nav.mediaDevices.getDisplayMedia) {
      return nav.mediaDevices.getDisplayMedia({ video: true });
    } else {
      return nav.mediaDevices.getUserMedia({
        video: { mediaSource: 'screen' },
      });
    }
  }
}

import { ScreenService } from './../shared/device/screen.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'wn-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss'],
})
export class HelpdeskComponent implements AfterViewInit {
  @ViewChild('screen') screenRef: ElementRef<HTMLVideoElement>;
  screen: HTMLVideoElement;

  constructor(private screenService: ScreenService) {}

  ngAfterViewInit() {
    this.screen = this.screenRef.nativeElement;
  }

  async capture() {
    const stream = await this.screenService.share();
    this.screen.srcObject = stream;
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'wn-banner',
  templateUrl: './banner.component.svg',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements AfterViewInit {
  @ViewChild('header') headerRef: ElementRef<SVGGElement>;
  headerGroup: SVGGElement;

  @ViewChild('free') freeRef: ElementRef<SVGGElement>;
  freeGroup: SVGGElement;

  @ViewChild('players') playersRef: ElementRef<SVGGElement>;
  playersGroup: SVGGElement;

  confirmNewWorld = false;

  @HostBinding('class.new-world') get isNewWorld() {
    return this.confirmNewWorld;
  }

  constructor() {}

  ngAfterViewInit() {
    console.log(this.freeRef);
    this.freeGroup = this.freeRef.nativeElement;

    console.log(this.playersRef);
    this.playersGroup = this.playersRef.nativeElement;

    console.log(this.headerRef);
    this.headerGroup = this.headerRef.nativeElement;
  }

  @HostListener('click')
  iWantaNewWorld() {
    this.headerGroup.classList.add('new-world');
    this.confirmNewWorld = true;
  }
}

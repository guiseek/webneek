import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { OverlayModule } from '@angular/cdk/overlay';
import { PopoverComponent } from './popover.component';
import { PopoverArrowDirective } from './popover-arrow.directive';
import { PopoverCloseDirective } from './popover-close.directive';
import { PopoverOpenDirective } from './popover-open.directive';
import { PopoverService } from './popover.service';

@NgModule({
  providers: [PopoverService],
  imports: [CommonModule, OverlayModule, PortalModule],
  exports: [PopoverCloseDirective, PopoverOpenDirective],
  declarations: [
    PopoverComponent,
    PopoverArrowDirective,
    PopoverCloseDirective,
    PopoverOpenDirective,
  ],
})
export class UiPopoverModule {}

import { Directive, HostListener, Input, Optional } from '@angular/core';
import { PopoverRef } from './popover-ref';

@Directive({
  selector: '[wnPopoverClose]',
})
export class PopoverCloseDirective<T = any> {
  @Input('wnPopoverClose') popoverResult: T;

  constructor(@Optional() private popoverRef: PopoverRef<T>) {}

  @HostListener('click') onClick(): void {
    if (!this.popoverRef) {
      console.error('wnPopoverClose is not supported within a template');
      return;
    }

    this.popoverRef.close(this.popoverResult);
  }
}

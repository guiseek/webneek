import { InjectionToken } from '@angular/core';

export class PopoverConfig<T = any> {
  backdropClass = '';
  data?: T;
  disableClose = false;
  panelClass: string | string[] = '';
  arrowOffset? = 30;
  arrowSize? = 20;
}

export const POPOVER_CONFIG = new InjectionToken<PopoverConfig>(
  'PopoverConfig'
);

// export const POPOVER_DEFAULT: PopoverConfig = {
//   backdropClass: '',
//   disableClose: false,
//   panelClass: '',
//   arrowOffset: 30,
//   arrowSize: 20,
// };

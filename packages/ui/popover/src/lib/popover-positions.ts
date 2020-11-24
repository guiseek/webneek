import { ConnectionPositionPair } from '@angular/cdk/overlay';

export const getPopoverPositions = (
  panelOffset: number,
  arrowOffset: number
): ConnectionPositionPair[] => {
  return [
    // bottom center
    {
      overlayX: 'center',
      overlayY: 'top',
      originX: 'center',
      originY: 'bottom',
      panelClass: ['top', 'center'],
      offsetY: panelOffset,
    },

    // top center
    {
      overlayX: 'center',
      overlayY: 'bottom',
      originX: 'center',
      originY: 'top',
      panelClass: ['bottom', 'center'],
      offsetY: -1 * panelOffset,
    },
    // top left
    {
      overlayX: 'start',
      overlayY: 'bottom',
      originX: 'center',
      originY: 'top',
      panelClass: ['bottom', 'left'],
      offsetX: -1 * arrowOffset,
      offsetY: -1 * panelOffset,
    },
    // top right
    {
      overlayX: 'end',
      overlayY: 'bottom',
      originX: 'center',
      originY: 'top',
      panelClass: ['bottom', 'right'],
      offsetX: arrowOffset,
      offsetY: -1 * panelOffset,
    },
    // bottom left
    {
      overlayX: 'start',
      overlayY: 'top',
      originX: 'center',
      originY: 'bottom',
      panelClass: ['top', 'left'],
      offsetX: -1 * arrowOffset,
      offsetY: panelOffset,
    },
    // bottom right
    {
      overlayX: 'end',
      overlayY: 'top',
      originX: 'center',
      originY: 'bottom',
      panelClass: ['top', 'right'],
      offsetX: arrowOffset,
      offsetY: panelOffset,
    },
  ];
};

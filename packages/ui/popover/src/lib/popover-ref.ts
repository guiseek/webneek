import {
  OverlayRef,
  ConnectedOverlayPositionChange,
  FlexibleConnectedPositionStrategy,
} from '@angular/cdk/overlay';
import { filter } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { PopoverConfig } from './popover-config';

export class PopoverRef<T = any> {
  private afterClosedSubject = new Subject<T>();

  constructor(
    private overlayRef: OverlayRef,
    private positionStrategy: FlexibleConnectedPositionStrategy,
    public config: PopoverConfig
  ) {
    if (!config.disableClose) {
      this.overlayRef.backdropClick().subscribe(() => {
        this.close();
      });
      const scapeKey = (event: KeyboardEvent) => event.key === 'Escape';
      this.overlayRef
        .keydownEvents()
        .pipe(filter(scapeKey))
        .subscribe(() => this.close());
    }
  }

  close(dialogResult?: T): void {
    this.afterClosedSubject.next(dialogResult);
    this.afterClosedSubject.complete();

    this.overlayRef.dispose();
  }

  afterClosed(): Observable<T> {
    return this.afterClosedSubject.asObservable();
  }

  positionChanges(): Observable<ConnectedOverlayPositionChange> {
    return this.positionStrategy.positionChanges;
  }
}

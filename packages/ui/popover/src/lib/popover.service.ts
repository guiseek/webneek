import {
  PortalInjector,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';
import { Overlay, ComponentType } from '@angular/cdk/overlay';
import { ElementRef, Injectable, Injector, TemplateRef } from '@angular/core';
import { PopoverConfig, POPOVER_CONFIG } from './popover-config';
import { getPopoverPositions } from './popover-positions';
import { PopoverComponent } from './popover.component';
import { PopoverRef } from './popover-ref';

@Injectable()
export class PopoverService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open<D = any>(
    componentOrTemplate: ComponentType<any> | TemplateRef<any>,
    target: ElementRef | HTMLElement,
    config: Partial<PopoverConfig> = {}
  ): PopoverRef<D> {
    const initial = new PopoverConfig();
    const popoverConfig: PopoverConfig = Object.assign({}, initial, config);

    const arrowSize = popoverConfig.arrowSize;
    const arrowOffset = popoverConfig.arrowOffset;
    const panelOffset = arrowSize / 2;

    // preferred positions, in order of priority
    const positions = getPopoverPositions(panelOffset, arrowOffset);

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(target)
      .withPush(false)
      .withFlexibleDimensions(false)
      .withPositions(positions);

    const overlayRef = this.overlay.create({
      hasBackdrop: true,
      panelClass: config.panelClass,
      backdropClass: config.backdropClass,
      positionStrategy: positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const popoverRef = new PopoverRef(
      overlayRef,
      positionStrategy,
      popoverConfig
    );

    const popover = overlayRef.attach(
      new ComponentPortal(
        PopoverComponent,
        null,
        // tslint:disable-next-line: deprecation
        new PortalInjector(
          this.injector,
          new WeakMap<any, any>([[PopoverRef, popoverRef]])
        )
      )
    ).instance;

    if (componentOrTemplate instanceof TemplateRef) {
      // rendering a provided template dynamically
      popover.attachTemplatePortal(
        new TemplatePortal(componentOrTemplate, null, {
          $implicit: config.data,
          popover: popoverRef,
        })
      );
    } else {
      // rendering a provided component dynamically
      popover.attachComponentPortal(
        new ComponentPortal(
          componentOrTemplate,
          null,
          // tslint:disable-next-line: deprecation
          new PortalInjector(
            this.injector,
            new WeakMap<any, any>([
              [POPOVER_CONFIG, config.data],
              [PopoverRef, popoverRef],
            ])
          )
        )
      );
    }

    return popoverRef;
  }
}

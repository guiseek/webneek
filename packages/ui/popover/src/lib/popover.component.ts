import {
  ViewChild,
  Component,
  HostBinding,
  ComponentRef,
  EmbeddedViewRef,
} from '@angular/core';
import {
  BasePortalOutlet,
  CdkPortalOutlet,
  ComponentPortal,
  TemplatePortal,
} from '@angular/cdk/portal';

@Component({
  selector: 'wn-popover',
  template: `
    <ng-template cdkPortalOutlet></ng-template>
    <div class="arrow" wnPopoverArrow></div>
  `,
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent extends BasePortalOutlet {
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet: CdkPortalOutlet;
  @HostBinding('class.ui-popover') cls = true;

  attachComponentPortal<T>(
    componentPortal: ComponentPortal<any>
  ): ComponentRef<T> {
    return this.portalOutlet.attachComponentPortal(componentPortal);
  }

  attachTemplatePortal<C>(portal: TemplatePortal<C>): EmbeddedViewRef<C> {
    return this.portalOutlet.attachTemplatePortal(portal);
  }
}

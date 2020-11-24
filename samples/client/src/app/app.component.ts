import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'Fundação de livre comunicação';
  // title = 'Free Communication Foundation';
}

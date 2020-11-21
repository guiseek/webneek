import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Message {
  event: string;
  data: any;
}

@Component({
  selector: 'main',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'client';

  messages = new BehaviorSubject<Message[]>([]);
  messages$ = this.messages.asObservable();

  ngOnInit() {
    const socket = new WebSocket('ws://localhost:8080');

    const setMessage = (data: Object) => JSON.stringify(data);
    const getMessage = (data: MessageEvent) => JSON.parse(data.data);
    const onMessage = (data: MessageEvent) => {
      const messages = [...this.messages.value, getMessage(data)];
      this.messages.next(messages);
    };
    const onOpen = () => {
      socket.send(setMessage({ event: 'events', data: 'test' }));
      socket.addEventListener('message', onMessage);
    };

    socket.addEventListener('open', onOpen);
  }
}

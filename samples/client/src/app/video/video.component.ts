import { Component, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, merge } from 'rxjs';
import { scan, map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import {
  ActionTypes,
  FormData,
  ClientConnected,
  Data,
  ValuePatched,
  Action,
  Init,
  State,
  reducer,
} from '@webneek/rtc-data';

import {
  getPatchValueEffect,
  getValuePatchedEffect,
  getFormChangesEffect,
} from './effects';
import { WebSocketFacade } from '../shared/data';

@Component({
  selector: 'wn-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  private dispatcher = new BehaviorSubject<Action>(new Init());

  actions$ = this.dispatcher.asObservable();

  store$ = this.actions$.pipe(
    scan((state: State, action: Action) => reducer(state, action))
  );

  connectedClients$ = this.store$.pipe(
    map((state: State) => state.connectedClients)
  );

  data$ = this.store$.pipe(map((state: State) => state.data));

  title$ = this.data$.pipe(map((state: Partial<FormData>) => state.title));

  description$ = this.data$.pipe(
    map((state: Partial<FormData>) => state.description)
  );

  form = this.fb.group({
    title: [''],
    description: [''],
  });

  constructor(private socket: WebSocketFacade, private fb: FormBuilder) {}

  ngOnInit() {
    this.socket.on(ActionTypes.ClientConnected, (payload: string[]) => {
      this.dispatcher.next(new ClientConnected(payload));
    });

    this.socket.on(ActionTypes.Data, (payload: Partial<FormData>) => {
      this.dispatcher.next(new Data(payload));
    });

    this.socket.on(ActionTypes.ValuePatched, (payload: Partial<FormData>) => {
      this.dispatcher.next(new ValuePatched(payload));
    });

    merge(
      getPatchValueEffect(this.socket, this.actions$),
      getValuePatchedEffect(this.form, this.actions$),
      getFormChangesEffect(this.form, this.dispatcher)
    ).subscribe();
  }
}

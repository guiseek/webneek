import { Observable, asyncScheduler } from 'rxjs';
import { observeOn, filter, tap } from 'rxjs/operators';
import { Action, ActionTypes } from '@webneek/rtc-data';
import { RtcSocket } from '../rtc-socket';

export const getPatchValueEffect = (
  socket: RtcSocket,
  actions: Observable<Action>
) => {
  // const webSocket = new WebSocket('ws:localhost:3333')
  // webSocket.send()
  return actions.pipe(
    observeOn(asyncScheduler),
    filter((action) => action.type === ActionTypes.PatchValue),
    tap((action) => socket.emit(ActionTypes.PatchValue, action.payload))
  );
};

import { ActionTypes } from '../../core';

export class ClientConnected {
  type = ActionTypes.ClientConnected;

  constructor(public payload: string[]) {}
}

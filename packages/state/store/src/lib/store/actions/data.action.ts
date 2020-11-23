import { ActionTypes, FormData } from '../../core';

export class Data {
  type = ActionTypes.Data;

  constructor(public payload: Partial<FormData>) {}
}

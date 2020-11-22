import { ActionTypes, FormData } from '../../core';

export class ValuePatched {
  type = ActionTypes.ValuePatched;

  constructor(public payload: Partial<FormData>) {}
}

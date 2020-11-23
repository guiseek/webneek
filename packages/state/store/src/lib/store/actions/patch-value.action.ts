import { ActionTypes, FormData } from '../../core';

export class PatchValue {
  type = ActionTypes.PatchValue;

  constructor(public payload: Partial<FormData>) {}
}

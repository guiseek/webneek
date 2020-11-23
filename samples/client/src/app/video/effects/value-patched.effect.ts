import { Action, ActionTypes } from '@nx-state/store';
import { Observable, asyncScheduler } from 'rxjs';
import { observeOn, filter, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

export const getValuePatchedEffect = (
  form: FormGroup,
  actions: Observable<Action>
) => {
  return actions.pipe(
    observeOn(asyncScheduler),
    filter(
      (action) =>
        action.type === ActionTypes.ValuePatched ||
        action.type === ActionTypes.Data
    ),
    tap((action) => form.patchValue(action.payload, { emitEvent: false }))
  );
};

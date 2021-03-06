import { Action, FormData, PatchValue } from '@nx-state/store';
import { merge, BehaviorSubject } from 'rxjs';
import { debounceTime, map, tap } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

export const getFormChangesEffect = (
  form: FormGroup,
  dispatcher: BehaviorSubject<Action>
) => {
  const title$ = form
    .get('title')
    .valueChanges.pipe(map((title: string) => ({ title })));

  const description$ = form
    .get('description')
    .valueChanges.pipe(map((description: string) => ({ description })));

  return merge(title$, description$).pipe(
    // debounceTime(300),
    tap((payload: Partial<FormData>) =>
      dispatcher.next(new PatchValue(payload))
    )
  );
};

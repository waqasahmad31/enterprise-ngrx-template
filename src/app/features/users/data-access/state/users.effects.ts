import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, from, map, mergeMap, of, switchMap, catchError, tap } from 'rxjs';

import { mapHttpError } from '@core/http/http-error.mapper';
import { ToastService } from '@core/notifications/toast.service';
import { APP_MESSAGES, APP_ROUTES } from '@domain/constants';

import { UsersApiService } from '../users-api.service';
import { usersActions } from './users.actions';

@Injectable()
export class UsersEffects {
  private readonly actions$ = inject(Actions);
  private readonly api = inject(UsersApiService);
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);

  readonly loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.loadUsers),
      switchMap(() =>
        from(this.api.list()).pipe(
          map((users) => usersActions.loadUsersSuccess({ users })),
          catchError((err) => of(usersActions.loadUsersFailure({ error: mapHttpError(err) }))),
        ),
      ),
    ),
  );

  readonly loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.loadUser),
      mergeMap(({ id }) =>
        from(this.api.getById(id)).pipe(
          map((user) => usersActions.loadUserSuccess({ user })),
          catchError((err) => of(usersActions.loadUserFailure({ id, error: mapHttpError(err) }))),
        ),
      ),
    ),
  );

  readonly createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.createUser),
      concatMap(({ payload }) =>
        from(this.api.create(payload)).pipe(
          map((user) => usersActions.createUserSuccess({ user })),
          catchError((err) => of(usersActions.createUserFailure({ error: mapHttpError(err) }))),
        ),
      ),
    ),
  );

  readonly createUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usersActions.createUserSuccess),
        tap(() => this.toasts.success(APP_MESSAGES.users.created)),
        tap(() => void this.router.navigateByUrl(APP_ROUTES.users.root)),
      ),
    { dispatch: false },
  );

  readonly updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.updateUser),
      concatMap(({ id, patch }) =>
        from(this.api.update(id, patch)).pipe(
          map((user) => usersActions.updateUserSuccess({ user })),
          catchError((err) => of(usersActions.updateUserFailure({ id, error: mapHttpError(err) }))),
        ),
      ),
    ),
  );

  readonly updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usersActions.updateUserSuccess),
        tap(() => this.toasts.success(APP_MESSAGES.users.updated)),
        tap(({ user }) => void this.router.navigateByUrl(APP_ROUTES.users.details(user.id))),
      ),
    { dispatch: false },
  );

  readonly deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(usersActions.deleteUser),
      mergeMap(({ id }) =>
        from(this.api.delete(id)).pipe(
          map(() => usersActions.deleteUserSuccess({ id })),
          catchError((err) => of(usersActions.deleteUserFailure({ id, error: mapHttpError(err) }))),
        ),
      ),
    ),
  );

  readonly deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(usersActions.deleteUserSuccess),
        tap(() => this.toasts.success(APP_MESSAGES.users.deleted)),
      ),
    { dispatch: false },
  );
}

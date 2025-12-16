import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import { Router, type UrlTree } from '@angular/router';
import { from, map, catchError, of, tap } from 'rxjs';
import { Store } from '@ngrx/store';

import type { User } from '@domain/users/user.model';

import { UsersApiService } from '../data-access/users-api.service';
import { usersActions } from '../data-access/state/users.actions';

export const userResolver: ResolveFn<User | UrlTree> = (route) => {
  const id = route.paramMap.get('id');
  if (!id) {
    return inject(Router).parseUrl('/error');
  }

  const api = inject(UsersApiService);
  const store = inject(Store);
  const router = inject(Router);

  return from(api.getById(id)).pipe(
    tap((user) => store.dispatch(usersActions.loadUserSuccess({ user }))),
    map((user) => user),
    catchError(() => of(router.parseUrl('/error'))),
  );
};

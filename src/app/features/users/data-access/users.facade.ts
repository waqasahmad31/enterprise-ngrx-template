import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, take } from 'rxjs';

import type { User, UserCreate, UserUpdate } from '@domain/users/user.model';

import {
  selectUserEntities,
  selectAllUsers,
  selectError,
  selectListLoading,
  selectSaving,
} from './state/users.feature';
import { usersActions } from './state/users.actions';

@Injectable()
export class UsersFacade {
  private readonly store = inject(Store);

  readonly users$ = this.store.select(selectAllUsers);
  readonly listLoading$ = this.store.select(selectListLoading);
  readonly saving$ = this.store.select(selectSaving);
  readonly error$ = this.store.select(selectError);

  loadUsers(): void {
    this.store.dispatch(usersActions.loadUsers());
  }

  loadUser(id: string): void {
    this.store.dispatch(usersActions.loadUser({ id }));
  }

  createUser(payload: UserCreate): void {
    this.store.dispatch(usersActions.createUser({ payload }));
  }

  updateUser(id: string, patch: UserUpdate): void {
    this.store.dispatch(usersActions.updateUser({ id, patch }));
  }

  deleteUser(id: string): void {
    this.store.dispatch(usersActions.deleteUser({ id }));
  }

  selectById(id: string) {
    return this.store.select(selectUserEntities).pipe(map((entities) => entities[id]));
  }

  ensureUserLoaded(id: string) {
    this.loadUser(id);
    return this.selectById(id).pipe(
      filter((u): u is User => !!u),
      take(1),
    );
  }
}

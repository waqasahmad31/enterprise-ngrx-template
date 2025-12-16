import { createEntityAdapter, type EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import type { AppError } from '@domain/errors/app-error';
import type { User } from '@domain/users/user.model';

import { usersActions } from './users.actions';

export type UsersState = EntityState<User> & {
  listLoading: boolean;
  saving: boolean;
  error: AppError | null;
};

const adapter = createEntityAdapter<User>({
  selectId: (u) => u.id,
  sortComparer: (a, b) =>
    `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`),
});

const initialState: UsersState = adapter.getInitialState({
  listLoading: false,
  saving: false,
  error: null,
});

export const usersFeature = createFeature({
  name: 'users',
  reducer: createReducer(
    initialState,

    on(usersActions.clearError, (state) => ({ ...state, error: null })),

    on(usersActions.loadUsers, (state) => ({ ...state, listLoading: true, error: null })),
    on(usersActions.loadUsersSuccess, (state, { users }) =>
      adapter.setAll(users, { ...state, listLoading: false }),
    ),
    on(usersActions.loadUsersFailure, (state, { error }) => ({
      ...state,
      listLoading: false,
      error,
    })),

    on(usersActions.loadUser, (state) => ({ ...state, error: null })),
    on(usersActions.loadUserSuccess, (state, { user }) => adapter.upsertOne(user, state)),
    on(usersActions.loadUserFailure, (state, { error }) => ({ ...state, error })),

    on(usersActions.createUser, (state) => ({ ...state, saving: true, error: null })),
    on(usersActions.createUserSuccess, (state, { user }) =>
      adapter.addOne(user, { ...state, saving: false }),
    ),
    on(usersActions.createUserFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(usersActions.updateUser, (state) => ({ ...state, saving: true, error: null })),
    on(usersActions.updateUserSuccess, (state, { user }) =>
      adapter.upsertOne(user, { ...state, saving: false }),
    ),
    on(usersActions.updateUserFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),

    on(usersActions.deleteUser, (state) => ({ ...state, saving: true, error: null })),
    on(usersActions.deleteUserSuccess, (state, { id }) =>
      adapter.removeOne(id, { ...state, saving: false }),
    ),
    on(usersActions.deleteUserFailure, (state, { error }) => ({
      ...state,
      saving: false,
      error,
    })),
  ),
});

export const {
  name: usersFeatureKey,
  reducer: usersReducer,
  selectUsersState,
  selectListLoading,
  selectSaving,
  selectError,
} = usersFeature;

export const {
  selectAll: selectAllUsers,
  selectEntities: selectUserEntities,
  selectIds: selectUserIds,
  selectTotal: selectUsersTotal,
} = adapter.getSelectors(selectUsersState);

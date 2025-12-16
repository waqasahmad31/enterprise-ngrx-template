import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { AppError } from '@domain/errors/app-error';
import type { User, UserCreate, UserUpdate } from '@domain/users/user.model';

export const usersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: AppError }>(),

    'Load User': props<{ id: string }>(),
    'Load User Success': props<{ user: User }>(),
    'Load User Failure': props<{ id: string; error: AppError }>(),

    'Create User': props<{ payload: UserCreate }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: AppError }>(),

    'Update User': props<{ id: string; patch: UserUpdate }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ id: string; error: AppError }>(),

    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ id: string; error: AppError }>(),

    'Clear Error': emptyProps(),
  },
});

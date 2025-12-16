import type { Routes } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { APP_TITLES } from '@domain/constants';

import { UsersApiService } from './data-access/users-api.service';
import { UsersFacade } from './data-access/users.facade';
import { UsersEffects } from './data-access/state/users.effects';
import { usersFeature } from './data-access/state/users.feature';
import { userResolver } from './resolvers/user.resolver';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      UsersApiService,
      UsersFacade,
      provideState(usersFeature),
      provideEffects(UsersEffects),
    ],
    children: [
      {
        path: '',
        title: APP_TITLES.users.list,
        loadComponent: () =>
          import('./pages/users-list-page/users-list-page.component').then(
            (m) => m.UsersListPageComponent,
          ),
      },
      {
        path: 'new',
        title: APP_TITLES.users.create,
        loadComponent: () =>
          import('./pages/user-edit-page/user-edit-page.component').then(
            (m) => m.UserEditPageComponent,
          ),
      },
      {
        path: ':id',
        title: APP_TITLES.users.details,
        resolve: { user: userResolver },
        loadComponent: () =>
          import('./pages/user-details-page/user-details-page.component').then(
            (m) => m.UserDetailsPageComponent,
          ),
      },
      {
        path: ':id/edit',
        title: APP_TITLES.users.edit,
        resolve: { user: userResolver },
        loadComponent: () =>
          import('./pages/user-edit-page/user-edit-page.component').then(
            (m) => m.UserEditPageComponent,
          ),
      },
    ],
  },
];

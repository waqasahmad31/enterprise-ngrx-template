import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    title: APP_TITLES.auth.login,
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then((m) => m.LoginPageComponent),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];

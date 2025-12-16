import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const ROLES_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.roles,
    loadComponent: () =>
      import('./pages/roles-page/roles-page.component').then((m) => m.RolesPageComponent),
  },
];

import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.profile,
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then((m) => m.ProfilePageComponent),
  },
];

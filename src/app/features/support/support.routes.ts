import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const SUPPORT_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.support,
    loadComponent: () =>
      import('./pages/support-page/support-page.component').then((m) => m.SupportPageComponent),
  },
];

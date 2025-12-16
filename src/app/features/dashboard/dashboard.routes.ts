import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.dashboard,
    loadComponent: () =>
      import('./pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent,
      ),
  },
];

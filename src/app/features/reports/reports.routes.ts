import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.reports,
    loadComponent: () =>
      import('./pages/reports-page/reports-page.component').then((m) => m.ReportsPageComponent),
  },
];

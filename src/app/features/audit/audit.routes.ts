import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const AUDIT_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.audit,
    loadComponent: () =>
      import('./pages/audit-page/audit-page.component').then((m) => m.AuditPageComponent),
  },
];

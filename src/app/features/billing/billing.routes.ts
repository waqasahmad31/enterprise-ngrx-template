import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const BILLING_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.billing,
    loadComponent: () =>
      import('./pages/billing-page/billing-page.component').then((m) => m.BillingPageComponent),
  },
];

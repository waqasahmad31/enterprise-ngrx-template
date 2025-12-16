import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const INTEGRATIONS_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.integrations,
    loadComponent: () =>
      import('./pages/integrations-page/integrations-page.component').then(
        (m) => m.IntegrationsPageComponent,
      ),
  },
];

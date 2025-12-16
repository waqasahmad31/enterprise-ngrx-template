import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.settings,
    loadComponent: () =>
      import('./pages/settings-page/settings-page.component').then((m) => m.SettingsPageComponent),
  },
];

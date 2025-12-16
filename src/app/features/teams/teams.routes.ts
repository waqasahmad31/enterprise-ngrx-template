import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const TEAMS_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.teams,
    loadComponent: () =>
      import('./pages/teams-page/teams-page.component').then((m) => m.TeamsPageComponent),
  },
];

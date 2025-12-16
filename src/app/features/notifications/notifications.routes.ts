import type { Routes } from '@angular/router';

import { APP_TITLES } from '@domain/constants';

export const NOTIFICATIONS_ROUTES: Routes = [
  {
    path: '',
    title: APP_TITLES.notifications,
    loadComponent: () =>
      import('./pages/notifications-page/notifications-page.component').then(
        (m) => m.NotificationsPageComponent,
      ),
  },
];

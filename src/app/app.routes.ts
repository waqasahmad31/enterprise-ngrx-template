import type { Routes } from '@angular/router';

import { permissionGuard } from '@core/auth/permission.guard';
import { authGuard } from '@core/auth/auth.guard';

import { PERMISSIONS } from '@domain/constants';

import { PublicLayoutComponent } from './app-shell/layouts/public-layout/public-layout.component';
import { ShellLayoutComponent } from './app-shell/layouts/shell-layout/shell-layout.component';
import { ErrorPageComponent } from './app-shell/pages/error-page/error-page.component';
import { NotFoundPageComponent } from './app-shell/pages/not-found-page/not-found-page.component';
import { AccessDeniedPageComponent } from './app-shell/pages/access-denied-page/access-denied-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
    ],
  },
  {
    path: '',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'profile',
        loadChildren: () =>
          import('@features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
        data: { preload: true },
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('@features/notifications/notifications.routes').then(
            (m) => m.NOTIFICATIONS_ROUTES,
          ),
        data: { preload: true },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
        data: { preload: true },
      },
      {
        path: 'users',
        canActivate: [permissionGuard],
        loadChildren: () => import('@features/users/users.routes').then((m) => m.USERS_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.usersRead] },
      },
      {
        path: 'reports',
        canActivate: [permissionGuard],
        loadChildren: () =>
          import('@features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.reportsRead] },
      },
      {
        path: 'audit',
        canActivate: [permissionGuard],
        loadChildren: () => import('@features/audit/audit.routes').then((m) => m.AUDIT_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.auditRead] },
      },
      {
        path: 'teams',
        canActivate: [permissionGuard],
        loadChildren: () => import('@features/teams/teams.routes').then((m) => m.TEAMS_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.teamsRead] },
      },
      {
        path: 'roles',
        canActivate: [permissionGuard],
        loadChildren: () => import('@features/roles/roles.routes').then((m) => m.ROLES_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.rolesRead] },
      },
      {
        path: 'billing',
        canActivate: [permissionGuard],
        loadChildren: () =>
          import('@features/billing/billing.routes').then((m) => m.BILLING_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.billingRead] },
      },
      {
        path: 'integrations',
        canActivate: [permissionGuard],
        loadChildren: () =>
          import('@features/integrations/integrations.routes').then((m) => m.INTEGRATIONS_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.integrationsRead] },
      },
      {
        path: 'support',
        canActivate: [permissionGuard],
        loadChildren: () =>
          import('@features/support/support.routes').then((m) => m.SUPPORT_ROUTES),
        data: { preload: true, permissions: [PERMISSIONS.supportRead] },
      },
      {
        path: 'settings',
        canActivate: [permissionGuard],
        data: { permissions: [PERMISSIONS.settingsRead] },
        loadChildren: () =>
          import('@features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
      },
      {
        path: 'error',
        component: ErrorPageComponent,
      },
      {
        path: 'forbidden',
        component: AccessDeniedPageComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

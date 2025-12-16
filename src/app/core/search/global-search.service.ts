import { Injectable, inject } from '@angular/core';
import { combineLatest, map, of } from 'rxjs';

import { UserDirectoryService } from '@core/users/user-directory.service';
import { APP_ROUTES } from '@domain/constants';

import type { SearchResult } from './search.models';

const NAV_RESULTS: SearchResult[] = [
  {
    id: 'route.dashboard',
    type: 'route',
    label: 'Dashboard',
    description: 'Overview and KPIs',
    icon: 'home',
    route: APP_ROUTES.dashboard,
  },
  {
    id: 'route.users',
    type: 'route',
    label: 'Users',
    description: 'User directory and access',
    icon: 'group',
    route: APP_ROUTES.users.root,
  },
  {
    id: 'route.settings',
    type: 'route',
    label: 'Settings',
    description: 'Organization and preferences',
    icon: 'settings',
    route: APP_ROUTES.settings,
  },
  {
    id: 'route.notifications',
    type: 'route',
    label: 'Notifications',
    description: 'All notifications',
    icon: 'notifications',
    route: APP_ROUTES.notifications,
  },
  {
    id: 'route.profile',
    type: 'route',
    label: 'Profile',
    description: 'Your account details',
    icon: 'person',
    route: APP_ROUTES.profile,
  },
  {
    id: 'route.reports',
    type: 'route',
    label: 'Reports',
    description: 'Operational reports',
    icon: 'query_stats',
    route: APP_ROUTES.reports,
  },
  {
    id: 'route.audit',
    type: 'route',
    label: 'Audit logs',
    description: 'Security and activity logs',
    icon: 'verified_user',
    route: APP_ROUTES.audit,
  },
  {
    id: 'route.teams',
    type: 'route',
    label: 'Teams',
    description: 'Teams and membership',
    icon: 'groups',
    route: APP_ROUTES.teams,
  },
  {
    id: 'route.roles',
    type: 'route',
    label: 'Roles',
    description: 'Roles and permissions',
    icon: 'badge',
    route: APP_ROUTES.roles,
  },
  {
    id: 'route.billing',
    type: 'route',
    label: 'Billing',
    description: 'Plan and invoices',
    icon: 'credit_card',
    route: APP_ROUTES.billing,
  },
  {
    id: 'route.integrations',
    type: 'route',
    label: 'Integrations',
    description: 'Connected apps',
    icon: 'link',
    route: APP_ROUTES.integrations,
  },
  {
    id: 'route.support',
    type: 'route',
    label: 'Support',
    description: 'Help and tickets',
    icon: 'help',
    route: APP_ROUTES.support,
  },
];

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  private readonly users = inject(UserDirectoryService);

  search(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return of([] as SearchResult[]);

    const nav$ = of(
      NAV_RESULTS.filter((r) => {
        const hay = `${r.label} ${r.description ?? ''}`.toLowerCase();
        return hay.includes(q);
      }),
    );

    const users$ = this.users.searchUsers(query).pipe(
      map((users) =>
        users.slice(0, 6).map(
          (u): SearchResult => ({
            id: `user.${u.id}`,
            type: 'user',
            label: `${u.firstName} ${u.lastName}`,
            description: u.email,
            icon: 'person',
            route: `/users/${encodeURIComponent(u.id)}`,
          }),
        ),
      ),
    );

    return combineLatest([nav$, users$]).pipe(
      map(([nav, users]) => [...nav, ...users].slice(0, 10)),
    );
  }
}

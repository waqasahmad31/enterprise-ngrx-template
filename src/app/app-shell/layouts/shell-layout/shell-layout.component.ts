import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Subject, switchMap, take } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AuthService } from '@core/auth/auth.service';
import { GlobalSearchService } from '@core/search/global-search.service';
import { NotificationCenterService } from '@core/notifications/notification-center.service';
import { ThemeModeService } from '@core/theme/theme-mode.service';
import { APP_ROUTES, PERMISSIONS } from '@domain/constants';
import type { SearchResult } from '@core/search/search.models';
import type { AppNotification } from '@core/notifications/notification.models';
import type { Permission } from '@domain/auth/auth.models';

@Component({
  selector: 'app-shell-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    AsyncPipe,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatListModule,
  ],
  templateUrl: './shell-layout.component.html',
  styleUrl: './shell-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellLayoutComponent {
  private readonly auth = inject(AuthService);
  private readonly breakpoints = inject(BreakpointObserver);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly themeMode = inject(ThemeModeService);
  private readonly search = inject(GlobalSearchService);
  private readonly notifications = inject(NotificationCenterService);
  private readonly router = inject(Router);

  readonly APP_ROUTES = APP_ROUTES;

  readonly user$ = this.auth.user$;
  private readonly userSignal = toSignal(this.auth.user$, { initialValue: null });
  readonly themeModeSignal = this.themeMode.mode;
  readonly unreadCount$ = this.notifications.unreadCount$;
  readonly notificationItems$ = this.notifications.items$;
  readonly unreadCountSignal = toSignal(this.unreadCount$, { initialValue: 0 });
  readonly notificationItemsSignal = toSignal(this.notificationItems$, { initialValue: [] });

  drawerOpen = false;

  searchQuery = '';
  searchSuggestions: SearchResult[] = [];

  private readonly searchQuery$ = new Subject<string>();

  readonly navSections = computed(() => {
    const user = this.userSignal();
    const permissions = new Set(user?.permissions ?? []);

    const linkItem = (label: string, icon: string, route: string, permission?: Permission) => ({
      label,
      icon,
      route,
      visible: permission ? permissions.has(permission) : true,
    });

    return [
      {
        label: 'Main',
        items: [
          linkItem('Dashboard', 'home', APP_ROUTES.dashboard),
          linkItem('Notifications', 'notifications', APP_ROUTES.notifications),
          linkItem('Profile', 'person', APP_ROUTES.profile),
        ],
      },
      {
        label: 'Management',
        items: [
          linkItem('Users', 'group', APP_ROUTES.users.root, PERMISSIONS.usersRead),
          linkItem('Teams', 'account_tree', APP_ROUTES.teams, PERMISSIONS.teamsRead),
          linkItem('Roles', 'badge', APP_ROUTES.roles, PERMISSIONS.rolesRead),
          linkItem('Settings', 'settings', APP_ROUTES.settings, PERMISSIONS.settingsRead),
        ],
      },
      {
        label: 'Operations',
        items: [
          linkItem('Reports', 'query_stats', APP_ROUTES.reports, PERMISSIONS.reportsRead),
          linkItem('Audit logs', 'verified_user', APP_ROUTES.audit, PERMISSIONS.auditRead),
          linkItem('Integrations', 'link', APP_ROUTES.integrations, PERMISSIONS.integrationsRead),
          linkItem('Billing', 'credit_card', APP_ROUTES.billing, PERMISSIONS.billingRead),
        ],
      },
      {
        label: 'Support',
        items: [linkItem('Support', 'help', APP_ROUTES.support, PERMISSIONS.supportRead)],
      },
    ];
  });

  readonly isHandset = toSignal(
    this.breakpoints.observe([Breakpoints.Handset]).pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  readonly sidenavMode = computed(() => (this.isHandset() ? 'over' : 'side'));
  readonly sidenavOpened = computed(() => (!this.isHandset() ? true : this.drawerOpen));

  constructor() {
    this.searchQuery$
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        switchMap((query) => this.search.search(query).pipe(take(1))),
        takeUntilDestroyed(),
      )
      .subscribe((results) => {
        this.searchSuggestions = results;
        this.cdr.markForCheck();
      });
  }

  logout(): void {
    this.auth.logout();
  }

  toggleThemeMode(): void {
    this.themeMode.toggle();
  }

  toggleDrawer(): void {
    if (!this.isHandset()) return;
    this.drawerOpen = !this.drawerOpen;
  }

  closeDrawer(): void {
    if (!this.isHandset()) return;
    this.drawerOpen = false;
  }

  onSearchInput(value: string): void {
    const query = (value ?? '').toString().trim();
    if (!query) {
      this.searchSuggestions = [];
      return;
    }
    this.searchQuery$.next(query);
  }

  selectSearch(selected: SearchResult): void {
    if (selected?.route) {
      void this.router.navigateByUrl(selected.route);
      this.closeDrawer();
    }
    this.searchQuery = '';
    this.searchSuggestions = [];
  }

  markAllNotificationsRead(): void {
    this.notifications.markAllRead();
  }

  openNotification(n: AppNotification): void {
    this.notifications.markRead(n.id);
    const next = n.link ?? APP_ROUTES.notifications;
    void this.router.navigateByUrl(next);
    this.closeDrawer();
  }

  openNav(route: string): void {
    void this.router.navigateByUrl(route);
    this.closeDrawer();
  }

  iconFor(result: SearchResult): string {
    const icon = (result.icon ?? '').toString().trim();
    return icon || 'search';
  }
}

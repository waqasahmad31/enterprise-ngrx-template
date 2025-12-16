import { Injectable, DestroyRef, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '@core/auth/auth.service';

import type { AppNotification, NotificationSeverity } from './notification.models';

const makeId = () => `n_${Math.random().toString(16).slice(2)}`;

@Injectable({ providedIn: 'root' })
export class NotificationCenterService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);

  private readonly _items = new BehaviorSubject<AppNotification[]>([]);
  readonly items$ = this._items.asObservable();

  readonly unreadCount$ = this.items$.pipe(
    map((items) => items.reduce((acc, n) => acc + (n.readAtEpochMs ? 0 : 1), 0)),
  );

  constructor() {
    // Seed a few notifications for the demo app when a user logs in.
    this.auth.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((user) => {
      if (!user) {
        this._items.next([]);
        return;
      }

      if (this._items.value.length > 0) return;

      const now = Date.now();
      this._items.next([
        {
          id: makeId(),
          title: 'Welcome back',
          message: `Signed in as ${user.displayName}.`,
          severity: 'success',
          createdAtEpochMs: now - 60_000,
          link: '/profile',
        },
        {
          id: makeId(),
          title: 'Users module',
          message: 'New users can be created from the Users list.',
          severity: 'info',
          createdAtEpochMs: now - 10 * 60_000,
          link: '/users',
        },
        {
          id: makeId(),
          title: 'Security',
          message: 'Review audit logs regularly (demo feature).',
          severity: 'warn',
          createdAtEpochMs: now - 60 * 60_000,
          link: '/audit',
        },
      ]);
    });
  }

  push(
    title: string,
    message: string,
    severity: NotificationSeverity = 'info',
    link?: string,
  ): void {
    const next: AppNotification = {
      id: makeId(),
      title,
      message,
      severity,
      createdAtEpochMs: Date.now(),
      link,
    };

    this._items.next([next, ...this._items.value]);
  }

  markRead(id: string): void {
    const now = Date.now();
    this._items.next(
      this._items.value.map((n) =>
        n.id === id && !n.readAtEpochMs ? { ...n, readAtEpochMs: now } : n,
      ),
    );
  }

  markAllRead(): void {
    const now = Date.now();
    this._items.next(
      this._items.value.map((n) => (n.readAtEpochMs ? n : { ...n, readAtEpochMs: now })),
    );
  }

  clear(): void {
    this._items.next([]);
  }
}

import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  Router,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
} from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class NavigationLoadingService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly loading = inject(LoadingService);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.router.events
      .pipe(
        filter(
          (e): e is NavigationStart | NavigationEnd | NavigationCancel | NavigationError =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          this.loading.beginNavigation();
        } else {
          this.loading.endNavigation();
        }
      });
  }
}

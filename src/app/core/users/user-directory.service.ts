import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';
import { AppConfigService } from '@core/config/app-config.service';
import { API_PATHS, PERMISSIONS } from '@domain/constants';
import type { User } from '@domain/users/user.model';

@Injectable({ providedIn: 'root' })
export class UserDirectoryService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);
  private readonly auth = inject(AuthService);

  searchUsers(query: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return of([] as User[]);
    }

    // Only fetch if the current user is allowed to read users.
    if (!this.auth.hasPermission(PERMISSIONS.usersRead)) {
      return of([] as User[]);
    }

    const q = query.trim().toLowerCase();
    if (!q) return of([] as User[]);

    const baseUrl = this.config.config().apiBaseUrl;
    return this.http.get<User[]>(`${baseUrl}${API_PATHS.users.root}`).pipe(
      map((users) =>
        users.filter((u) => {
          const hay = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase();
          return hay.includes(q);
        }),
      ),
      catchError(() => of([] as User[])),
    );
  }
}

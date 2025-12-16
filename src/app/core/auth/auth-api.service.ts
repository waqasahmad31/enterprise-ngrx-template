import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from '@core/config/app-config.service';
import { HTTP_HEADERS } from '@domain/constants/http-headers';
import { API_PATHS } from '@domain/constants/api-paths';
import type { AuthTokens, AuthUser, LoginRequest, LoginResponse } from '@domain/auth/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(AppConfigService);

  private apiUrl(path: string): string {
    return `${this.config.config().apiBaseUrl}${path}`;
  }

  csrf(): Observable<void> {
    return this.http.get<void>(this.apiUrl(API_PATHS.auth.csrf), {
      headers: { [HTTP_HEADERS.skipAuthRefresh]: '1' },
    });
  }

  me(): Observable<AuthUser> {
    return this.http.get<AuthUser>(this.apiUrl(API_PATHS.auth.me), {
      headers: { [HTTP_HEADERS.skipAuthRefresh]: '1' },
    });
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl(API_PATHS.auth.login), request);
  }

  logout(): Observable<void> {
    return this.http.post<void>(this.apiUrl(API_PATHS.auth.logout), null, {
      headers: { [HTTP_HEADERS.skipAuthRefresh]: '1' },
    });
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(this.apiUrl(API_PATHS.auth.refresh), { refreshToken });
  }

  refreshCookie(): Observable<void> {
    return this.http.post<void>(this.apiUrl(API_PATHS.auth.refresh), null, {
      headers: { [HTTP_HEADERS.skipAuthRefresh]: '1' },
    });
  }
}

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { AuthApiService } from '@core/auth/auth-api.service';
import { LoggingService } from '@core/logging/logging.service';
import { BrowserStorageService } from '@core/platform/browser-storage.service';
import { ToastService } from '@core/notifications/toast.service';
import { APP_MESSAGES, APP_ROUTES } from '@domain/constants';
import type {
  AuthTokens,
  AuthUser,
  LoginRequest,
  Permission,
  UserRole,
} from '@domain/auth/auth.models';

import { environment } from '@env/environment';

interface StoredAuthSession {
  user: AuthUser;
  tokens: AuthTokens;
}

const STORAGE_KEY = 'auth.session.v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggingService);
  private readonly toasts = inject(ToastService);
  private readonly storage = inject(BrowserStorageService);
  private readonly platformId = inject(PLATFORM_ID);

  private initPromise: Promise<void> | null = null;

  private readonly _user = new BehaviorSubject<AuthUser | null>(null);
  private readonly _tokens = new BehaviorSubject<AuthTokens | null>(null);

  readonly user$ = this._user.asObservable();
  readonly tokens$ = this._tokens.asObservable();

  private refreshPromise: Promise<AuthTokens | null> | null = null;
  private cookieRefreshPromise: Promise<boolean> | null = null;

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Production path: cookie-based sessions (no tokens in JS).
   * Dev/mock path: token-based (mock API interceptor).
   */
  private get usesCookieAuth(): boolean {
    return environment.production || !environment.mockApiEnabled;
  }

  /**
   * Dev-only persistence for mock mode.
   * Production apps should prefer HttpOnly cookie sessions or another server-driven approach.
   */
  private get canPersistSession(): boolean {
    return (
      this.isBrowser &&
      !this.usesCookieAuth &&
      !environment.production &&
      environment.mockApiEnabled
    );
  }

  get accessToken(): string | null {
    return this.usesCookieAuth ? null : (this._tokens.value?.accessToken ?? null);
  }

  get isAuthenticated(): boolean {
    if (this.usesCookieAuth) {
      return Boolean(this._user.value);
    }

    const tokens = this._tokens.value;
    return Boolean(tokens?.accessToken);
  }

  hasRole(role: UserRole): boolean {
    return this._user.value?.roles.includes(role) ?? false;
  }

  hasPermission(permission: Permission): boolean {
    return this._user.value?.permissions.includes(permission) ?? false;
  }

  async login(request: LoginRequest): Promise<boolean> {
    try {
      const response = await firstValueFrom(this.api.login(request));

      if (this.usesCookieAuth) {
        this._user.next(response.user);
        this._tokens.next(null);
      } else if (response.tokens) {
        this.setSession(response.user, response.tokens);
      }
      return true;
    } catch (error) {
      this.logger.warn('Login failed', { error });
      this.toasts.error(APP_MESSAGES.auth.invalidCredentials, APP_MESSAGES.auth.signInFailedTitle);
      return false;
    }
  }

  /**
   * App bootstrap hook.
   * In dev/mock mode: restores last session from local storage and validates it via /auth/me.
   */
  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInit();
    return this.initPromise;
  }

  private async doInit(): Promise<void> {
    if (!this.isBrowser) return;

    if (this.usesCookieAuth) {
      await this.initCookieSession();
      return;
    }

    if (!this.canPersistSession) return;

    const saved = this.storage.getJson<StoredAuthSession>(STORAGE_KEY);
    if (!saved?.tokens?.accessToken || !saved?.tokens?.refreshToken || !saved?.user) {
      return;
    }

    // Restore cached values immediately to avoid auth-guard flicker.
    this.setSession(saved.user, saved.tokens);

    // Validate restored session (and refresh user permissions/roles if needed).
    try {
      const user = await firstValueFrom(this.api.me());

      this._user.next(user);
    } catch (error) {
      this.logger.warn('Session restore failed', { error });
      this.clearSession();
    }
  }

  logout(): void {
    if (this.usesCookieAuth) {
      try {
        void firstValueFrom(this.api.logout());
      } catch {
        // Best-effort.
      }
    }

    this.clearSession();
    void this.router.navigateByUrl(APP_ROUTES.auth.login);
  }

  async refreshTokens(): Promise<AuthTokens | null> {
    if (this.usesCookieAuth) return null;

    if (this.refreshPromise) return this.refreshPromise;

    const current = this._tokens.value;
    if (!current?.refreshToken) return null;

    this.refreshPromise = this.doRefresh(current.refreshToken).finally(() => {
      this.refreshPromise = null;
    });

    return this.refreshPromise;
  }

  private async doRefresh(refreshToken: string): Promise<AuthTokens | null> {
    try {
      const next = await firstValueFrom(this.api.refreshToken(refreshToken));

      const user = this._user.value;
      if (user) this.setSession(user, next);

      return next;
    } catch (error) {
      this.logger.warn('Token refresh failed', { error });
      this.clearSession();
      return null;
    }
  }

  private setSession(user: AuthUser, tokens: AuthTokens): void {
    this._user.next(user);
    this._tokens.next(tokens);

    if (this.canPersistSession) {
      this.storage.setJson(STORAGE_KEY, { user, tokens } satisfies StoredAuthSession);
    }
  }

  private clearSession(): void {
    this._user.next(null);
    this._tokens.next(null);

    if (this.canPersistSession) {
      this.storage.remove(STORAGE_KEY);
    }
  }

  private async initCookieSession(): Promise<void> {
    try {
      // Ensure the XSRF cookie exists so Angular will attach the header on POST/PUT/etc.
      await firstValueFrom(this.api.csrf());

      const user = await firstValueFrom(this.api.me());

      this._user.next(user);
      this._tokens.next(null);
    } catch {
      // Not logged in (or server not available) — that's ok.
      this._user.next(null);
      this._tokens.next(null);
    }
  }

  async refreshCookieSession(): Promise<boolean> {
    if (!this.usesCookieAuth) return false;
    if (!this.isBrowser) return false;

    if (this.cookieRefreshPromise) return this.cookieRefreshPromise;

    this.cookieRefreshPromise = this.doCookieRefresh().finally(() => {
      this.cookieRefreshPromise = null;
    });

    return this.cookieRefreshPromise;
  }

  private async doCookieRefresh(): Promise<boolean> {
    try {
      await firstValueFrom(this.api.refreshCookie());

      // Refresh succeeded; re-sync user.
      const user = await firstValueFrom(this.api.me());

      this._user.next(user);
      this._tokens.next(null);
      return true;
    } catch (error) {
      this.logger.warn('Cookie session refresh failed', { error });
      this.clearSession();
      return false;
    }
  }
}

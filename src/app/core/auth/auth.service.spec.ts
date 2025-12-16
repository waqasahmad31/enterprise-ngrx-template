import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { AppConfigService } from '@core/config/app-config.service';
import { LoggingService } from '@core/logging/logging.service';
import { ToastService } from '@core/notifications/toast.service';
import type { AuthTokens, AuthUser, LoginRequest, LoginResponse } from '@domain/auth/auth.models';
import { APP_MESSAGES, APP_ROUTES } from '@domain/constants';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const httpMock = {
    post: vi.fn(),
  } as unknown as HttpClient;

  const routerMock = {
    navigateByUrl: vi.fn().mockResolvedValue(true),
  } as unknown as Router;

  const configValue = {
    apiBaseUrl: '/api',
    featureFlags: {
      enableUsers: true,
    },
  } as const;

  const configMock: Pick<AppConfigService, 'config'> = {
    // AppConfigService.config is a signal; for tests we expose a function with the same call shape.
    config: (() => configValue) as any,
  };

  const loggerMock: Pick<LoggingService, 'warn'> = {
    warn: vi.fn(),
  } as any;

  const toastsMock: Pick<ToastService, 'error'> = {
    error: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpMock },
        { provide: Router, useValue: routerMock },
        { provide: AppConfigService, useValue: configMock },
        { provide: LoggingService, useValue: loggerMock },
        { provide: ToastService, useValue: toastsMock },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  function makeUser(overrides: Partial<AuthUser> = {}): AuthUser {
    return {
      id: 'u_1',
      email: 'user@test.dev',
      displayName: 'Test User',
      roles: ['admin'],
      permissions: ['users.read'],
      ...overrides,
    } as AuthUser;
  }

  function makeTokens(overrides: Partial<AuthTokens> = {}): AuthTokens {
    return {
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      expiresAtEpochMs: Date.now() + 10 * 60 * 1000,
      ...overrides,
    } as AuthTokens;
  }

  it('logs in successfully and sets user + tokens in memory', async () => {
    const user = makeUser();
    const tokens = makeTokens();
    const request: LoginRequest = { email: user.email, password: 'pwd' };

    const response: LoginResponse = {
      user,
      tokens,
    };

    (httpMock.post as any).mockReturnValue(of(response));

    const result = await service.login(request);

    expect(result).toBe(true);
    expect(service.isAuthenticated).toBe(true);
    expect(service.accessToken).toBe(tokens.accessToken);
    expect(service.hasRole(user.roles[0]!)).toBe(true);
    expect(service.hasPermission(user.permissions[0]!)).toBe(true);
    expect(toastsMock.error).not.toHaveBeenCalled();
    expect(loggerMock.warn).not.toHaveBeenCalled();
  });

  it('handles login failure with toast and logs warning', async () => {
    const request: LoginRequest = { email: 'x@test.dev', password: 'bad' };

    (httpMock.post as any).mockReturnValue(throwError(() => new Error('Invalid')));

    const result = await service.login(request);

    expect(result).toBe(false);
    expect(service.isAuthenticated).toBe(false);
    expect(service.accessToken).toBeNull();

    expect(loggerMock.warn).toHaveBeenCalled();
    expect(toastsMock.error).toHaveBeenCalledWith(
      APP_MESSAGES.auth.invalidCredentials,
      APP_MESSAGES.auth.signInFailedTitle,
    );
  });

  it('returns null from refreshTokens when there is no refresh token', async () => {
    const tokens = await service.refreshTokens();
    expect(tokens).toBeNull();
    expect(httpMock.post as any).not.toHaveBeenCalled();
  });

  it('refreshes tokens when refresh token is present', async () => {
    const user = makeUser();
    const tokens = makeTokens();

    // Seed internal state directly for this unit test.
    (service as any)._user.next(user);
    (service as any)._tokens.next(tokens);

    const nextTokens = makeTokens({ accessToken: 'access-2' });
    (httpMock.post as any).mockReturnValue(of(nextTokens));

    const refreshed = await service.refreshTokens();

    expect(refreshed).toEqual(nextTokens);
    expect(service.accessToken).toBe('access-2');
    expect(httpMock.post as any).toHaveBeenCalledWith('/api/auth/refresh', {
      refreshToken: 'refresh-1',
    });
  });

  it('clears session when refresh fails', async () => {
    const user = makeUser();
    const tokens = makeTokens();

    (service as any)._user.next(user);
    (service as any)._tokens.next(tokens);

    (httpMock.post as any).mockReturnValue(throwError(() => new Error('boom')));

    const refreshed = await service.refreshTokens();

    expect(refreshed).toBeNull();
    expect(service.isAuthenticated).toBe(false);
    expect(service.accessToken).toBeNull();
    expect(loggerMock.warn).toHaveBeenCalled();
  });

  it('logout clears session and navigates to login', () => {
    const user = makeUser();
    const tokens = makeTokens();

    (service as any)._user.next(user);
    (service as any)._tokens.next(tokens);

    service.logout();

    expect(service.isAuthenticated).toBe(false);
    expect(service.accessToken).toBeNull();
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith(APP_ROUTES.auth.login);
  });
});

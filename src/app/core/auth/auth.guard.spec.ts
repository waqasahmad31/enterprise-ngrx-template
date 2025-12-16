import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { APP_ROUTES } from '@domain/constants';

import { AuthService } from './auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const authMock: Partial<AuthService> = {
    isAuthenticated: false,
  } as AuthService;

  const routerMock = {
    createUrlTree: vi.fn(),
  } as unknown as Router;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  it('allows navigation when user is authenticated', () => {
    (authMock as any).isAuthenticated = true;

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/dashboard' } as any),
    );

    expect(result).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to login with returnUrl when user is not authenticated', () => {
    (authMock as any).isAuthenticated = false;

    const urlTree = {} as any;
    (routerMock.createUrlTree as any).mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as any, { url: '/users' } as any),
    );

    expect(routerMock.createUrlTree).toHaveBeenCalledWith([APP_ROUTES.auth.login], {
      queryParams: { returnUrl: '/users' },
    });
    expect(result).toBe(urlTree);
  });
});

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import type { Permission } from '@domain/auth/auth.models';

import { AuthService } from './auth.service';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
  const authMock: Partial<AuthService> = {
    hasPermission: vi.fn(),
  } as any;

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

  it('allows navigation when no permissions are specified', () => {
    const route = { data: {} } as any;

    const result = TestBed.runInInjectionContext(() => permissionGuard(route, undefined as any));

    expect(result).toBe(true);
    expect(authMock.hasPermission).not.toHaveBeenCalled();
  });

  it('allows navigation when all required permissions are granted', () => {
    const perms: Permission[] = ['users:read' as Permission];
    const route = { data: { permissions: perms } } as any;

    (authMock.hasPermission as any).mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => permissionGuard(route, undefined as any));

    expect(authMock.hasPermission).toHaveBeenCalledWith(perms[0]);
    expect(result).toBe(true);
  });

  it('redirects to /forbidden when any permission is missing', () => {
    const perms: Permission[] = ['billing:read' as Permission];
    const route = { data: { permissions: perms } } as any;

    (authMock.hasPermission as any).mockReturnValue(false);

    const urlTree = {} as any;
    (routerMock.createUrlTree as any).mockReturnValue(urlTree);

    const result = TestBed.runInInjectionContext(() => permissionGuard(route, undefined as any));

    expect(authMock.hasPermission).toHaveBeenCalledWith(perms[0]);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/forbidden']);
    expect(result).toBe(urlTree);
  });
});

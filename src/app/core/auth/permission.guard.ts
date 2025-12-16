import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import type { Permission } from '@domain/auth/auth.models';

import { AuthService } from './auth.service';

export const permissionGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const permissions = (route.data?.['permissions'] as Permission[] | undefined) ?? [];

  if (permissions.length === 0) {
    return true;
  }

  const ok = permissions.every((p) => auth.hasPermission(p));
  if (ok) return true;

  return router.createUrlTree(['/forbidden']);
};

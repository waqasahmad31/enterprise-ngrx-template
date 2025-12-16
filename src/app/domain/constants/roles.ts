import type { UserRole } from '@domain/auth/auth.models';

export const ROLES = {
  admin: 'admin',
  manager: 'manager',
  user: 'user',
} as const satisfies Record<string, UserRole>;

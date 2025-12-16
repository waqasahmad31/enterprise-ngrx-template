export type UserRole = 'admin' | 'manager' | 'user';

export type Permission =
  | 'users.read'
  | 'users.write'
  | 'settings.read'
  | 'settings.write'
  | 'reports.read'
  | 'audit.read'
  | 'teams.read'
  | 'roles.read'
  | 'billing.read'
  | 'integrations.read'
  | 'support.read';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  permissions: Permission[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAtEpochMs: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  /**
   * Token-based auth (dev/mock) returns tokens.
   * Cookie-based auth (production) sets HttpOnly cookies and omits tokens.
   */
  tokens?: AuthTokens;
}

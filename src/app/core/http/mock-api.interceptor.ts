import {
  HttpResponse,
  type HttpEvent,
  type HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

import { LoggingService } from '@core/logging/logging.service';
import type { AuthUser, LoginRequest, LoginResponse } from '@domain/auth/auth.models';
import { API_PATHS, HTTP_HEADERS, MOCK_CREDENTIALS, PERMISSIONS, ROLES } from '@domain/constants';
import type { User, UserCreate, UserUpdate } from '@domain/users/user.model';

const NETWORK_DELAY_MS = 250;

const nowIso = () => new Date().toISOString();

const makeTokens = () => {
  const accessToken = `access.${Math.random().toString(16).slice(2)}`;
  const refreshToken = `refresh.${Math.random().toString(16).slice(2)}`;
  return {
    accessToken,
    refreshToken,
    expiresAtEpochMs: Date.now() + 10 * 60 * 1000,
  };
};

interface MockApiState {
  users: User[];
  refreshToAccess: Record<string, string>;
  accessToUserId: Record<string, string>;
}

interface RefreshRequest {
  refreshToken?: string;
}

const getState = (): MockApiState => {
  const container = globalThis as typeof globalThis & {
    __MOCK_API_STATE__?: MockApiState;
  };

  if (!container.__MOCK_API_STATE__) {
    container.__MOCK_API_STATE__ = {
      users: [
        {
          id: 'u_1',
          email: MOCK_CREDENTIALS.admin.email,
          firstName: 'Ada',
          lastName: 'Admin',
          isActive: true,
          createdAtIso: nowIso(),
        },
        {
          id: 'u_2',
          email: MOCK_CREDENTIALS.user.email,
          firstName: 'Uma',
          lastName: 'User',
          isActive: true,
          createdAtIso: nowIso(),
        },
      ],
      refreshToAccess: {},
      accessToUserId: {},
    };
  }

  return container.__MOCK_API_STATE__;
};

const adminPermissions = [
  PERMISSIONS.usersRead,
  PERMISSIONS.usersWrite,
  PERMISSIONS.settingsRead,
  PERMISSIONS.settingsWrite,
  PERMISSIONS.reportsRead,
  PERMISSIONS.auditRead,
  PERMISSIONS.teamsRead,
  PERMISSIONS.rolesRead,
  PERMISSIONS.billingRead,
  PERMISSIONS.integrationsRead,
  PERMISSIONS.supportRead,
] as const;

const userPermissions = [
  PERMISSIONS.usersRead,
  PERMISSIONS.settingsRead,
  PERMISSIONS.reportsRead,
  PERMISSIONS.supportRead,
] as const;

const makeAuthUser = (opts: { userId: string; email: string; isAdmin: boolean }): AuthUser => ({
  id: opts.userId,
  email: opts.email,
  displayName: opts.isAdmin ? 'Ada Admin' : 'Uma User',
  roles: [opts.isAdmin ? ROLES.admin : ROLES.user],
  permissions: opts.isAdmin ? [...adminPermissions] : [...userPermissions],
});

const requireAuth = (
  req: { headers: { get(name: string): string | null } },
  db: MockApiState,
): string => {
  const auth = req.headers.get(HTTP_HEADERS.authorization);
  if (!auth?.startsWith('Bearer ')) {
    throw new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
  }

  const token = auth.slice('Bearer '.length).trim();
  const userId = db.accessToUserId[token];
  if (!userId) {
    throw new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
  }

  return userId;
};

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);

  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const db = getState();

  const handle = (): Observable<HttpEvent<unknown>> => {
    try {
      const url = new URL(req.url, 'http://local');
      const path = url.pathname;

      const apiPrefix = '/api';
      const loginPath = `${apiPrefix}${API_PATHS.auth.login}`;
      const refreshPath = `${apiPrefix}${API_PATHS.auth.refresh}`;
      const mePath = `${apiPrefix}${API_PATHS.auth.me}`;
      const usersPath = `${apiPrefix}${API_PATHS.users.root}`;

      if (path === loginPath && req.method === 'POST') {
        const body = req.body as LoginRequest;

        const isAdmin =
          body.email === MOCK_CREDENTIALS.admin.email &&
          body.password === MOCK_CREDENTIALS.admin.password;
        const isUser =
          body.email === MOCK_CREDENTIALS.user.email &&
          body.password === MOCK_CREDENTIALS.user.password;

        if (!isAdmin && !isUser) {
          return throwError(
            () => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }),
          );
        }

        const userId = isAdmin ? 'u_1' : 'u_2';

        const tokens = makeTokens();
        db.refreshToAccess[tokens.refreshToken] = tokens.accessToken;
        db.accessToUserId[tokens.accessToken] = userId;

        const response: LoginResponse = {
          user: makeAuthUser({ userId, email: body.email, isAdmin }),
          tokens,
        };

        return of(new HttpResponse({ status: 200, body: response }));
      }

      if (path === refreshPath && req.method === 'POST') {
        const refreshToken = (req.body as RefreshRequest | null | undefined)?.refreshToken;
        const oldAccess = refreshToken ? db.refreshToAccess[refreshToken] : null;
        const userId = oldAccess ? db.accessToUserId[oldAccess] : null;
        if (!refreshToken || !oldAccess || !userId) {
          return throwError(
            () => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }),
          );
        }

        delete db.refreshToAccess[refreshToken];
        delete db.accessToUserId[oldAccess];

        const tokens = makeTokens();
        db.refreshToAccess[tokens.refreshToken] = tokens.accessToken;
        db.accessToUserId[tokens.accessToken] = userId;

        return of(new HttpResponse({ status: 200, body: tokens }));
      }

      if (path === mePath && req.method === 'GET') {
        const userId = requireAuth(req, db);
        const userRecord = db.users.find((u) => u.id === userId);

        if (!userRecord) {
          return throwError(
            () => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }),
          );
        }

        const isAdmin = userId === 'u_1';
        const user = makeAuthUser({ userId, email: userRecord.email, isAdmin });
        return of(new HttpResponse({ status: 200, body: user }));
      }

      if (path === usersPath && req.method === 'GET') {
        requireAuth(req, db);
        return of(new HttpResponse({ status: 200, body: db.users }));
      }

      if (path === usersPath && req.method === 'POST') {
        requireAuth(req, db);
        const body = req.body as UserCreate;
        const user: User = {
          id: `u_${Math.random().toString(16).slice(2)}`,
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          isActive: body.isActive,
          createdAtIso: nowIso(),
        };
        db.users = [user, ...db.users];
        return of(new HttpResponse({ status: 201, body: user }));
      }

      const userIdMatch = path.match(/^\/api\/users\/(.+)$/);
      if (userIdMatch) {
        requireAuth(req, db);
        const id = decodeURIComponent(userIdMatch[1]);
        const existing = db.users.find((u) => u.id === id);

        if (!existing) {
          return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
        }

        if (req.method === 'GET') {
          return of(new HttpResponse({ status: 200, body: existing }));
        }

        if (req.method === 'PUT') {
          const patch = req.body as UserUpdate;
          const updated: User = {
            ...existing,
            ...patch,
          };
          db.users = db.users.map((u) => (u.id === id ? updated : u));
          return of(new HttpResponse({ status: 200, body: updated }));
        }

        if (req.method === 'DELETE') {
          db.users = db.users.filter((u) => u.id !== id);
          return of(new HttpResponse({ status: 204 }));
        }
      }

      return next(req);
    } catch (error) {
      logger.warn('Mock API error', { error, url: req.url, method: req.method });
      return throwError(() => error);
    }
  };

  return handle().pipe(delay(NETWORK_DELAY_MS));
};

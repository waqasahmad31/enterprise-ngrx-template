# Auth

## Overview

Auth is implemented as a client-side session with:

- Access token + refresh token
- Permission/role checks
- Route guarding

## Core pieces

- `AuthService` (`src/app/core/auth/auth.service.ts`)
  - Holds user and tokens in `BehaviorSubject`
  - Persists session in browser storage
  - `login()`, `logout()`, `refreshTokens()`

- Guard: `authGuard` (`src/app/core/auth/auth.guard.ts`)
  - Redirects to `/auth/login?returnUrl=...`

- Guard: `permissionGuard` (`src/app/core/auth/permission.guard.ts`)
  - Uses `route.data.permissions`

## Refresh flow

- `authTokenInterceptor` attaches bearer token.
- If a request fails with 401, interceptor calls `AuthService.refreshTokens()` and retries once.

Loop protection:

- Uses a custom request header (`X-Skip-Auth-Refresh`) to prevent infinite refresh loops.

## Mock credentials

When mock API is enabled (dev):

- `admin@acme.test / admin`
- `user@acme.test / user`

These values are centralized in `src/app/domain/constants/mock-credentials.ts` as `MOCK_CREDENTIALS`.

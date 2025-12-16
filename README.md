# Enterprise NgRx Template (Angular 21)

Enterprise-oriented Angular 21 template using:

- Standalone APIs + lazy feature routes
- Angular Material (Material 3)
- NgRx (Store/Effects/Entity) with a complete `Users` feature
- Mock API via an in-app HTTP interceptor (no backend required)
- ESLint + Prettier + enforced "Nx-like" module boundaries (without Nx)

## Detailed documentation

For developer handoff/shareable docs per topic, see `docs/README.md`.

## Quickstart

```bash
npm install
npm start
```

Open `http://localhost:4200`.

Demo credentials (mock API):

- `admin@acme.test` / `admin`
- `user@acme.test` / `user`

## Scripts

- `npm start` / `ng serve`
- `npm run build`
- `npm run lint` (or `npm run lint -- --fix`)
- `npm test` (Vitest via Angular CLI)
- `npm run e2e:install` (one-time, installs Playwright browsers)
- `npm run e2e` (Playwright smoke tests)

## Architecture

The codebase is organized to keep dependency flow predictable and avoid circular deps:

- `src/app/domain` — pure domain models + errors (no Angular imports)
- `src/app/core` — app-wide singletons (auth, config, http interceptors, logging, error handling)
- `src/app/shared` — reusable UI + pipes
- `src/app/features/*` — lazy-loaded feature areas (no feature-to-feature imports)
- `src/app/app-shell` — layouts (public vs authenticated shell) and global pages (error/404)

### Module boundaries (Nx-like, without Nx)

Boundaries are enforced in ESLint (see `eslint.config.js`). In practice:

- A feature can import only:
  - itself
  - `@core/*`, `@shared/*`, `@domain/*`
- Features must not import other features.

Path aliases are configured in `tsconfig.json`:

- `@core/*`, `@shared/*`, `@domain/*`, `@features/*`

## Routing & SSR

Routing is defined in `src/app/app.routes.ts` and uses a public layout under `/auth/*` and an authenticated shell under `/`.

This project uses Angular's server output mode (SSR runtime). Server render-mode configuration lives in `src/app/app.routes.server.ts`.

## Auth & HTTP

- `AuthService` holds session state and supports refresh flow.
- `authTokenInterceptor` attaches bearer tokens.
- `apiErrorInterceptor` maps/logs errors and shows toasts.
- `mockApiInterceptor` serves `/api/*` endpoints in-memory:
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`
  - `GET/POST /api/users`
  - `GET/PUT/DELETE /api/users/:id`

### Production auth (cookie session via SSR server)

In production mode, this template is designed to run as a same-origin “BFF” using the SSR Express server in `src/server.ts`:

- Auth is stored in **HttpOnly cookies** (no access token in JS).
- Angular's XSRF support is used for state-changing requests.

Endpoints:

- `GET /api/auth/csrf` (sets `XSRF-TOKEN` cookie)
- `POST /api/auth/login` (CSRF protected; sets `access_token` + `refresh_token` cookies; returns `{ user }`)
- `GET /api/auth/me`
- `POST /api/auth/refresh` (CSRF protected; rotates the access cookie)
- `POST /api/auth/logout` (CSRF protected; clears cookies)

Required environment variables:

- `AUTH_JWT_SECRET` (required in production; used to sign/verify cookies)

Notes:

- The server-side `/api/auth/login` implementation is a template placeholder; wire it to your real identity provider.
- In dev/mock mode, the mock API interceptor provides token-based auth for local demos.

## Users (NgRx Feature)

The `Users` feature is lazy-loaded at `/users` and includes:

- List page (`/users`)
- Create page (`/users/new`)
- Details page (`/users/:id`) using a resolver
- Edit page (`/users/:id/edit`)

State is provided at the route level in `src/app/features/users/users.routes.ts` using `provideState`/`provideEffects`.

## Adding a new feature (recommended pattern)

1. Create `src/app/features/<feature>` with `*.routes.ts` and standalone pages/components.
2. Provide feature state/effects at the feature route root.
3. Only import `@domain`, `@core`, `@shared`, or the same feature.
4. Add the lazy route entry in `src/app/app.routes.ts`.

## E2E (Playwright)

One-time setup:

```bash
npm run e2e:install
```

Run E2E tests:

```bash
npm run e2e
```

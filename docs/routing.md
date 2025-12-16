# Routing

Routes are defined in `src/app/app.routes.ts`.

## Layout split

- Public area: `/auth/*`
  - Uses `PublicLayoutComponent`
  - Contains login route

- Authenticated area: `/` (shell)
  - Uses `ShellLayoutComponent`
  - Protected by `authGuard`

## Guards

- `authGuard`
  - Redirects unauthenticated users to `/auth/login` with `returnUrl`.

- `permissionGuard`
  - Reads `route.data.permissions`.
  - Redirects to `/error` if missing permissions.

## Lazy loading

Features are lazy-loaded via `loadChildren()` pointing to `*.routes.ts`.

## Preloading

`SelectivePreloadingStrategy` preloads routes where `data.preload === true`.

See also:

- SSR: `docs/ssr.md`
- Auth: `docs/auth.md`

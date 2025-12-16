# Architecture

## Goals

- Predictable dependency flow (avoid circular deps).
- Standalone Angular APIs (no NgModules).
- Lazy feature routing.
- SSR-ready patterns (server output mode).
- Clear cross-cutting services (auth, logging, config, error handling, notifications).

## Layers

### 1) `domain/`

Purpose: pure domain models and errors (no Angular imports).

Contains:

- Types like `User`, `AuthTokens`, permissions/roles.
- Error contracts like `AppError`.
- Constants that are safe to share across all layers.

Rule: `domain` must not import from `core/shared/features/app`.

### 2) `core/`

Purpose: application-wide singletons and cross-cutting infrastructure.

Examples:

- Auth session state
- HTTP interceptors
- Runtime config loader
- Logging service
- Global error handler

Rule: `core` may import only `core` and `domain`.

### 3) `shared/`

Purpose: reusable UI, pipes, and helpers used by multiple features.

Examples:

- Toast UI component
- Safe HTML pipe

Rule: `shared` may import `shared`, `core`, and `domain`.

### 4) `features/*/`

Purpose: product features that ship independently (lazy loaded).

Structure recommendation:

- `data-access/` for API + facades + state
- `pages/` for routed screens
- `components/` for local UI parts (optional)

Rule: features must not import other features.

### 5) `app-shell/`

Purpose: global layouts and app-level pages.

Examples:

- Public layout (`/auth/*`)
- Authenticated shell layout
- Error and 404 pages

## Bootstrap / composition

- Root providers are composed in `src/app/app.config.ts`.
- Root routes are in `src/app/app.routes.ts`.
- Feature state/effects are provided at the feature route root (route-level providers).

See also:

- Routing: `docs/routing.md`
- Rules: `docs/rules-and-boundaries.md`

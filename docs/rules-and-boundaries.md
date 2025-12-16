# Rules & module boundaries (Nx-like, without Nx)

Module boundaries are enforced via ESLint (`eslint-plugin-boundaries`).

## Allowed imports

- `domain` → only `domain`
- `core` → `core`, `domain`
- `shared` → `shared`, `core`, `domain`
- `feature` → `shared`, `core`, `domain`, and the **same** feature

In other words:

- A feature must **not** import any other feature.

## Path aliases

Configured in `tsconfig.json`:

- `@domain/*` → `src/app/domain/*`
- `@core/*` → `src/app/core/*`
- `@shared/*` → `src/app/shared/*`
- `@features/*` → `src/app/features/*`

## Public API recommendation

To keep “public APIs” explicit:

- Prefer importing from feature-local barrels (optional) or explicit files.
- Avoid deep imports across layers (except within the same feature).

## Why this matters

- Prevents accidental coupling between features.
- Makes features easier to move, delete, or rewrite.
- Minimizes circular dependencies.

See: `eslint.config.js`

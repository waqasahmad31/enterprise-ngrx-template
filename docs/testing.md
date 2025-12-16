# Testing (unit/component)

## Test runner

- `ng test` uses Vitest (via Angular CLI unit-test builder).

## Current coverage

- App bootstrap smoke test: `src/app/app.spec.ts`
- HTTP error mapping: `src/app/core/http/http-error.mapper.spec.ts`
- Users reducer: `src/app/features/users/data-access/state/users.feature.spec.ts`
- Users list page component: `src/app/features/users/pages/users-list-page/users-list-page.component.spec.ts`

## Recommended patterns

- Prefer fast unit tests for reducers/mappers.
- For standalone components, test via `TestBed` importing the component directly.
- Avoid depending on real HTTP; use facade stubs or mocked services.

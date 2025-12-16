# State management (NgRx)

## Strategy

- Root store/effects are provided in `src/app/app.config.ts`.
- Feature store/effects are provided at the route level (feature boundary).

This keeps feature state self-contained and lazy-loaded.

## Users feature example

Users feature demonstrates:

- Actions via `createActionGroup`
- Entity state via `@ngrx/entity`
- Effects for CRUD (load/list/create/update/delete)
- Facade wrapping store selectors/dispatch

See: `docs/users-feature.md`

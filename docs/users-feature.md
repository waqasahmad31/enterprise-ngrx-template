# Users feature (end-to-end walkthrough)

Route:

- `/users`

## Routes

Defined in `src/app/features/users/users.routes.ts`.

- Provides `UsersApiService`, `UsersFacade`, `provideState(usersFeature)`, `provideEffects(UsersEffects)`
- Pages:
  - List: `/users`
  - Create: `/users/new`
  - Details (resolver): `/users/:id`
  - Edit (resolver): `/users/:id/edit`

## Data access

- `UsersApiService`
  - Calls mock endpoints `/api/users...`

- `UsersFacade`
  - Exposes `users$`, `listLoading$`, `saving$`, `error$`
  - Dispatches actions

## State

- `users.actions.ts`
  - CRUD action set

- `users.feature.ts`
  - Entity adapter + reducer
  - Selectors

- `users.effects.ts`
  - Calls API
  - Maps errors with `mapHttpError`
  - Shows success toasts
  - Navigates after create/update

## Resolver

`userResolver` fetches the user before rendering details/edit routes.
On failure it returns a UrlTree to `/error`.

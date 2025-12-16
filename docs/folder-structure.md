# Folder structure

Top-level:

- `src/app/domain/` — domain types/errors/constants (no Angular)
- `src/app/core/` — cross-cutting services (auth, http, config, logging, error handling)
- `src/app/shared/` — reusable UI/pipes
- `src/app/features/` — lazy-loaded features
- `src/app/app-shell/` — layouts + global pages (error/404)

Feature structure (example: Users):

- `src/app/features/users/data-access/`
  - API service (`users-api.service.ts`)
  - Facade (`users.facade.ts`)
  - NgRx state (`state/*`)
- `src/app/features/users/pages/`
  - routed pages (list/details/edit)
- `src/app/features/users/resolvers/`
  - route resolver(s)

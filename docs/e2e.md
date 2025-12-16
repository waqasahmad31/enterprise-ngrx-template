# E2E (Playwright)

## Setup

One-time:

```bash
npm run e2e:install
```

## Run

```bash
npm run e2e
```

Playwright starts `ng serve` automatically using `webServer` config.

Config:

- `playwright.config.ts`
- Test directory: `e2e/`

## Current tests

- Redirect unauthenticated user from `/users` → `/auth/login`
- Sign in with mock credentials and open Users list

Notes:

- These E2E tests rely on the dev-only mock API interceptor.

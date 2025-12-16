# Scripts & commands

All scripts live in `package.json`.

Important: run commands from the project root folder (the one that contains `package.json`).

Example (Windows + Git Bash):

- `cd "/c/Users/PC/Desktop/Angular_Projects/enterprise-ngrx-template"`

## Dev

- `npm start`
  - Runs `ng serve`.

## Build

- `npm run build`
  - Production build.

## Lint & formatting

- `npm run lint`
  - ESLint (TypeScript + Angular templates) + boundaries rules.

- `npm run format`
  - Prettier write.

- `npm run format:check`
  - Prettier check.

## Unit tests

- `npm test`
  - Angular CLI test runner (Vitest).

Recommended CI-style single run:

- `npm test -- --watch=false`

## SSR run

- `npm run serve:ssr:enterprise-ngrx-template`
  - Runs the built SSR server bundle from `dist/.../server/server.mjs`.

## E2E (Playwright)

- `npm run e2e:install`
  - Installs browser binaries.

- `npm run e2e`
  - Runs Playwright tests.

- `npm run e2e:ui`
  - Runs Playwright UI mode.

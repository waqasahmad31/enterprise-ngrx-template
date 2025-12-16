# Runtime config & environments

## Build-time environment

Environment files live in:

- `src/environments/environment.ts`
- `src/environments/environment.prod.ts`

They provide defaults like:

- `apiBaseUrl`
- `featureFlags`
- logging settings

## Runtime config (optional)

`AppConfigService` loads `/config/app-config.json` at startup (browser only).

- File location: `public/config/app-config.json`
- Loader: `src/app/core/config/app-config.service.ts`
- Startup hook: `src/app/core/config/app-config.initializer.ts` (APP_INITIALIZER)

Merge strategy:

- Runtime values override build-time defaults.
- Feature flags are merged per-key.

SSR behavior:

- On the server, runtime config fetch is skipped; defaults are used.

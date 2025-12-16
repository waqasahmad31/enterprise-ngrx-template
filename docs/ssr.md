# SSR (server output mode)

This project uses Angular server output mode (SSR runtime).

## Where it’s configured

- Build config: `angular.json`
  - `outputMode: "server"`
  - `server: "src/main.server.ts"`
  - `ssr.entry: "src/server.ts"`

## Server routes rendering

`src/app/app.routes.server.ts` uses:

- `RenderMode.Server` for all routes (`**`).

This avoids prerendering parameterized routes by default.

## HttpClient fetch backend

`src/app/app.config.ts` uses `provideHttpClient(withFetch(), ...)`.

Reason:

- Better SSR compatibility and performance vs XHR backend.

## Notes

- Mock API is enabled only in non-production and works both in browser and SSR dev server.
- If you move to a real backend, remove/disable the mock API interceptor.

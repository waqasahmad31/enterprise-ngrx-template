# Troubleshooting

## Lint errors

- Run: `npm run lint -- --fix`
- Ensure templates use Angular built-in control flow (`@if`, `@for`) where required by lint rules.

## SSR / HttpClient warning

If you see SSR warnings about HttpClient/XHR backend:

- Ensure `withFetch()` is enabled in `src/app/app.config.ts`.

## Playwright webServer timeout

If `npm run e2e` times out waiting for the server:

- Try running with `--workers=1`.
- Confirm no other process is using port `4201`.
- Increase `webServer.timeout` in `playwright.config.ts` if needed.

## Mock API issues

- Mock API runs only when `environment.production` is false.
- Interceptor order must be: auth token → mock API → error interceptor.

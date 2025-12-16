# Toasts / notifications

## Service

`ToastService` (`src/app/core/notifications/toast.service.ts`)

- `success/info/warning/error(message, title?)`
- Auto-dismiss durations per type
- Keeps at most 4 toasts

SSR-safe behavior:

- Auto-dismiss uses `setTimeout` only in the browser.

## UI host

Toast UI is mounted once at the application root (browser-only to keep SSR safe).

- Host: `src/app/app.html`
- Modules: `src/app/app.ts`

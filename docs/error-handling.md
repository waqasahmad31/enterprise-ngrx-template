# Error handling

## Global errors

`GlobalErrorHandler` (`src/app/core/error/global-error-handler.ts`) implements Angular `ErrorHandler`.

Behavior:

- Logs the error (with context) via `LoggingService`.
- Shows a user-friendly toast message.

## Request/API errors

`apiErrorInterceptor`:

- Converts `unknown` errors into `AppError` using `mapHttpError()`.
- Logs structured info (url, method, mapped error).
- Displays a toast for non-401 errors.

## Error page

Route `/error` is available and renders an error page layout.

See also:

- `docs/http.md`
- `docs/toasts.md`

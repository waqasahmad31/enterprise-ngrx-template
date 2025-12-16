# HTTP (interceptors, error mapping, mock API)

## HttpClient configuration

Configured in `src/app/app.config.ts`:

- `withFetch()` (SSR-friendly)
- `withXsrfConfiguration()`
- `withInterceptors([...])`

Interceptor order matters (top-to-bottom):

1. `authTokenInterceptor`
   - Attaches `Authorization: Bearer <token>`

2. `mockApiInterceptor` (dev only)
   - Handles `/api/*` endpoints in-memory
   - Requires Authorization for protected endpoints

3. `apiErrorInterceptor`
   - Maps errors to `AppError`
   - Logs and shows toasts (except UNAUTHORIZED)

## Error mapping

`src/app/core/http/http-error.mapper.ts` maps `HttpErrorResponse` → `AppError`.

## Mock API

`src/app/core/http/mock-api.interceptor.ts`

Endpoints:

- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/users`
- `POST /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

State:

- Uses `globalThis.__MOCK_API_STATE__` to keep an in-memory DB.

Important:

- Mock API is enabled only when `environment.production === false`.

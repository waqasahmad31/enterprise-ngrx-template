# Constants & messages

## Why

Centralizing user-facing messages makes it easier to:

- Maintain consistent wording
- Change copy without hunting through files
- Prepare for future i18n

## Where

`src/app/domain/constants/app-messages.ts` exports `APP_MESSAGES`.

Additional constants:

- `src/app/domain/constants/app-routes.ts` exports `APP_ROUTES`
- `src/app/domain/constants/api-paths.ts` exports `API_PATHS`
- `src/app/domain/constants/app-titles.ts` exports `APP_TITLES`
- `src/app/domain/constants/http-headers.ts` exports `HTTP_HEADERS`
- `src/app/domain/constants/permissions.ts` exports `PERMISSIONS`
- `src/app/domain/constants/mock-credentials.ts` exports `MOCK_CREDENTIALS`
- `src/app/domain/constants/roles.ts` exports `ROLES`
- `src/app/domain/constants/storage-keys.ts` exports `STORAGE_KEYS`

Reason it lives in `domain/`:

- `core/` is not allowed to import from `shared/` (boundary rule).
- `domain/` can be imported by every layer.

## Current usage

- Login success/failure messages
- Global error handler toast message/title
- API error interceptor toast title
- Users CRUD success messages

## Current usage (non-message constants)

- `APP_ROUTES` is used for navigation and guard redirects.
- `API_PATHS` is used for composing URLs from runtime config `apiBaseUrl`.
- `HTTP_HEADERS` is used for:
  - Auth refresh loop protection header
  - XSRF cookie/header naming
- `STORAGE_KEYS` is used for the persisted auth session.

Recommendation (future):

- Consider adding constants for feature flags if you introduce them.

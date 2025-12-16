# Security & Deployment Guidelines

This document complements `docs/architecture.md` and `docs/http.md` with security-focused guidance for using this template in real production environments.

## 1. Token & Session Design

The template ships with a **front-end only** auth/session implementation intended as a starting point:

- Auth state is held **in memory** by `AuthService` (user + tokens are not persisted to localStorage or cookies by default).
- `auth-token.interceptor` attaches the current access token as `Authorization: Bearer <token>` to outgoing HTTP requests.
- A mock API (`mock-api.interceptor`) is available for local development and uses a simple `{ accessToken, refreshToken }` contract.

### Recommended production model

For real backends, we recommend:

- **Access token**
  - Short-lived (5–15 minutes).
  - Stored only in memory on the client.
  - Used for API authorization via `Authorization: Bearer <accessToken>`.
- **Refresh token**
  - Long-lived (days).
  - Stored in an **HttpOnly, Secure, SameSite cookie** managed by the backend.
  - Never exposed to JavaScript.
  - Used exclusively by the backend when handling `/auth/refresh`.

The frontend should:

- Call `/auth/login` with credentials and receive `user` + `accessToken` (refresh cookie is set by the backend).
- Call `/auth/refresh` without including the refresh token in the body; the backend reads the cookie and returns a new access token.
- Call `/auth/logout` to clear the refresh cookie and invalidate the session server-side.

## 2. Mock API Safety

The mock API is controlled by:

- `environment.mockApiEnabled` in `src/environments/*.ts`.
- The interceptor is wired in `src/app/app.config.ts` as:
  - Enabled when `!environment.production && environment.mockApiEnabled === true`.

**Guidance:**

- Keep `mockApiEnabled: true` only in local development builds.
- Set `mockApiEnabled: false` for any shared environment (test, staging, production).
- Do not rely on the mock API for security testing; it is intentionally simplified.

## 3. CSRF Considerations

If your API uses cookie-based authentication (session cookies or refresh tokens):

- Prefer `SameSite=Lax` or `SameSite=Strict` for auth cookies.
- For cross-site flows (e.g., third-party IdPs) where `SameSite=None` is required, ensure cookies are **Secure** and implement a CSRF strategy such as:
  - Double-submit cookie + custom header.
  - Server-generated anti-CSRF token stored in an HttpOnly cookie and mirrored in a request header.

The template configures XSRF headers via `withXsrfConfiguration` in `app.config.ts`; integrate this with your backend’s CSRF implementation if you use cookie-based auth.

## 4. HTTP Security Headers

At the reverse proxy or Node/Express layer, apply security headers such as:

- `Content-Security-Policy` (CSP)
  - Start with a **report-only** policy in non-prod.
  - Lock down script, style, image, and connect sources to only what your app requires.
- `Strict-Transport-Security` (HSTS)
  - Enforce HTTPS for all subsequent requests.
- `X-Frame-Options` or `frame-ancestors` (CSP)
  - Prevent clickjacking by disallowing framing except for trusted origins.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy` (e.g., `strict-origin-when-cross-origin`).
- `Permissions-Policy` to limit access to powerful APIs (geolocation, camera, etc.).

You can add these via your chosen reverse proxy (Nginx, Apache, cloud load balancer) or directly in the Express server (`src/server.ts`) using middleware.

## 5. Error Handling & Logging

- Global errors are handled by `GlobalErrorHandler` and surfaced via user-friendly toasts.
- HTTP errors are mapped to domain-level `AppError` instances by `http-error.mapper.ts`.
- `LoggingService` centralizes logging and supports log levels; integrate it with your observability stack (OpenTelemetry, App Insights, Datadog, etc.) by implementing the remote logging TODO.

**Recommendations:**

- Correlate client logs with backend logs using identifiers such as:
  - Correlation ID (per request).
  - Anonymous or pseudonymous user/session IDs.
- Ensure error messages shown to users do **not** reveal sensitive implementation details.

## 6. Deployment Checklist

Before deploying this template in production:

- [ ] Ensure `environment.production === true` for production builds.
- [ ] Ensure `environment.mockApiEnabled === false` for all shared environments (test/stage/prod).
- [ ] Configure HTTPS and HTTP→HTTPS redirects at your edge/proxy.
- [ ] Apply CSP, HSTS, and other security headers as described above.
- [ ] Integrate remote logging and monitoring.
- [ ] Run security and a11y scans (e.g., OWASP ZAP, Lighthouse, Playwright + axe-core).

## 7. Responsibilities Split

- **Template**
  - Provides safe defaults and structure for auth, error handling, and HTTP interactions.
  - Offers a mock backend for local development.
- **Your backend / platform**
  - Owns real authentication, authorization, CSRF, and token lifecycle.
  - Owns TLS, reverse proxy, rate limiting, and security headers.

Use this document as a starting point and tailor it to your organization’s security standards and threat model.

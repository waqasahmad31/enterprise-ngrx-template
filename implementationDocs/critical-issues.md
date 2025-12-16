# Critical Issues (Must Fix Before Production)

These items are **blocking** for deploying to real users. Each issue includes risk, why it’s critical, and concrete Angular 21-aligned remediation steps.

---

## CI-1 — Demo Credentials Prefilled in Login UI

**Problem description**

- The login form defaults to `MOCK_CREDENTIALS.admin.email/password` in the UI.
- This behavior is present in the runtime application (not only tests).

**Risk level**: High

**Why it is critical**

- Shipping prefilled credentials normalizes insecure behavior and increases the chance of accidental credential reuse.
- It can be interpreted as an intentional backdoor by security review/auditors.
- In multi-tenant or white-label reuse scenarios, this is easy to forget and ship.

**Exact steps to fix**

1. Update the login form defaults to empty strings.
2. Optionally add a **dev-only helper** (button or autofill function) guarded by `!environment.production` and/or `environment.mockApiEnabled`.
3. Ensure E2E tests still use explicit `.fill()` (they already do) so they remain stable.

**Angular 21 best-practice solution**

- Treat demo behavior as build-time gated:

```ts
// Example approach
const emailDefault = environment.production ? '' : MOCK_CREDENTIALS.admin.email;
const passwordDefault = environment.production ? '' : MOCK_CREDENTIALS.admin.password;
```

- Prefer an explicit “Use demo credentials” button that is only rendered in non-production builds.

---

## CI-2 — SSR Express Server Not Security Hardened

**Problem description**

- The SSR server (`src/server.ts`) is a minimal Express server.
- It does not set standard security headers, rate limits, request size limits, or compression.

**Risk level**: High

**Why it is critical**

- SSR servers are exposed to the public internet. Missing hardening increases risk of:
  - clickjacking / framing
  - XSS impact amplification without CSP
  - abusive traffic (DoS, brute force, scraping)
  - overly large payload attacks

**Exact steps to fix**

1. Add a security middleware baseline (commonly `helmet`).
2. Add rate limiting for sensitive endpoints (auth) and optionally global rate limiting.
3. Add `express.json({ limit: '...' })` and `express.urlencoded({ extended: false, limit: '...' })`.
4. Enable compression for SSR responses.
5. Disable fingerprinting headers (`app.disable('x-powered-by')`).
6. Define a CSP strategy compatible with Angular (at minimum: `default-src 'self'` and allow required sources).

**Angular 21 best-practice solution**

- Use defense-in-depth for the SSR host. Example (high-level):

```ts
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

app.disable('x-powered-by');
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // customize for your environment
      },
    },
  }),
);
app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 300 }));
```

(Exact CSP directives depend on your asset hosting, analytics, and error reporting.)

---

## CI-3 — Template Uses Beta NgRx Packages

**Problem description**

- `package.json` includes:
  - `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/store-devtools` as pre-release versions.

**Risk level**: High

**Why it is critical**

- A “reusable production boilerplate” should not rely on beta packages because:
  - API behavior may change unexpectedly
  - edge-case bugs may exist
  - enterprise compliance reviews may reject it

**Exact steps to fix**

1. Prefer the latest **stable** `@ngrx/*` versions compatible with your Angular major.
2. If stable is not published for your Angular major yet, use the newest `next` / RC and pin versions.
3. Run `npm install`, then run:
   - `npm run lint`
   - `npm test`
   - `npm run build`
   - `npm run e2e`

**Angular 21 best-practice solution**

- Keep Angular and NgRx versions aligned.

**Decision & current status (Angular 21 + NgRx RC)**

- The repo is intentionally on Angular 21.
- As of this implementation, `@ngrx/store` does not publish a stable `21.x` to npm; `latest` is `20.1.0` (Angular 20 peer), and `next` is `21.0.0-rc.0`.
- This template pins `@ngrx/*` to `21.0.0-rc.0` to match Angular 21 while avoiding beta.

**Follow-up (when NgRx 21 stable ships)**

- Upgrade `@ngrx/*` from `21.0.0-rc.0`  stable `21.x` and re-run the full verification suite.

---

## CI-4 — Authentication Strategy Is Incomplete for Production

**Problem description**

- Token-only (bearer) auth is not sufficient for production unless paired with a hardened refresh strategy.
- Production apps typically require a server-managed session (or equivalent) and an authenticated `/me` endpoint.

**Risk level**: High

**Why it is critical**

- Production auth must be explicitly designed. Common failure modes:
  - storing tokens in `localStorage` (XSS-exfiltration risk)
  - insecure refresh token handling
  - broken SSR authentication
  - inconsistent behavior after page refresh

**Exact steps to fix**

1. Decide on one of these approaches:
   - **Recommended**: session via **HttpOnly, Secure cookies** (backend-managed) + CSRF protections.
   - Alternative: in-memory access token + refresh via HttpOnly cookie.
2. Implement `/session` or `/me` endpoint to restore auth state on app bootstrap.
3. Update interceptors to match the chosen approach:
   - If cookie-based: remove bearer token attachment; rely on cookies; enable XSRF for unsafe methods.
   - If bearer-based: keep access token in memory and refresh via secure channel.
4. Add tests:
   - unit tests for refresh flows
   - e2e test for refresh-after-reload scenario

**Angular 21 best-practice solution**

- Prefer cookie-based sessions for browser apps:
  - HttpOnly cookies prevent direct JS access
  - Angular XSRF support can add defense for state-changing requests

**Current status (implemented)**

- A same-origin cookie session flow is implemented on the SSR Express server:
  - `GET /api/auth/csrf`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/refresh`
  - `POST /api/auth/logout`
- Client bootstraps auth state via `/auth/csrf` + `/auth/me` and refreshes via `/auth/refresh` on 401.
- Production requires `AUTH_JWT_SECRET` to be set.

---

## CI-5 — Lint Does Not Pass (Quality Gate Breaker)

**Problem description**

- `npm run lint` currently fails due to:
  - `@typescript-eslint/no-explicit-any` in multiple `*.spec.ts`
  - Prettier formatting errors in at least one spec file

**Risk level**: Medium–High (depends on your release process)

**Why it is critical**

- A base template should start **green**. If lint is failing on day one:
  - CI adoption gets delayed
  - quality gates are weakened
  - teams learn to ignore failures

**Exact steps to fix**

1. Decide whether test files should allow `any`.
2. Recommended: add an ESLint override for `**/*.spec.ts` to relax `no-explicit-any` (or refactor tests to avoid `any`).
3. Run `npm run format` and re-run `npm run lint`.

**Angular 21 best-practice solution**

- Maintain separate rulesets for production code vs tests:
  - production code stays strict
  - tests can be pragmatic but still typed where feasible

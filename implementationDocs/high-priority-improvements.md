# High-Priority Improvements (Strongly Recommended)

These are not always “hard blockers,” but they provide major gains in stability, scalability, security posture, and long-term maintainability.

---

## HP-1 — Add CI Pipeline + Quality Gates

**Impact**: Very high

**Why**

- A reusable template should have “push-button confidence” (lint/test/build/e2e).

**Implementation steps**

1. Add a CI workflow (GitHub Actions / Azure DevOps / GitLab CI):
   - `npm ci`
   - `npm run format:check`
   - `npm run lint`
   - `npm test` (headless)
   - `npm run build` (production)
   - `npm run e2e` (optional on main branch or nightly)
2. Cache npm dependencies.
3. Upload Playwright report artifacts in CI.
4. Add a release gate: fail the pipeline on lint/test failures.

**Verification**

- New PRs must show green checks.

---

## HP-2 — Stabilize and Align Dependency Versions

**Impact**: High

**Why**

- Dependencies are currently a mix of `^21.0.0`, `^21.0.3`, `^21.0.5`.
- NgRx is beta.

**Implementation steps**

1. Align Angular packages to the same patch/minor (Angular CLI usually prefers aligned versions).
2. Replace beta NgRx with stable versions.
3. Consider pinning versions (no `^`) for a boilerplate, or document upgrade policy.

**Verification**

- `npm install` clean.
- `npm run build` succeeds.

---

## HP-3 — Production-Grade Auth Integration Template

**Impact**: High

**Goal**

- Provide a “drop-in” pattern that teams can adapt: cookie session or hybrid token approach.

**Implementation steps**

1. Define an `AuthApiService` that:
   - calls `/auth/login`, `/auth/logout`, `/auth/refresh`, `/me`
2. Add bootstrap flow:
   - on app init, call `/me` and populate `AuthService` user state
3. Add a consistent error strategy:
   - 401 → attempt refresh once
   - refresh fails → logout + redirect
4. Update SSR strategy:
   - for cookie sessions, SSR can render authenticated pages if cookies are forwarded

**Verification**

- Hard reload while authenticated keeps the session.
- Protected routes don’t flicker.

---

## HP-4 — SSR Operational Hardening

**Impact**: High

**Implementation steps**

1. Add:
   - compression
   - helmet with CSP
   - rate limiting
   - request size limits
2. Add health endpoints:
   - `/healthz` (liveness)
   - `/readyz` (readiness)
3. Add structured server logging (request id, latency).

**Verification**

- Load test shows stable p95.
- Security headers verified in browser devtools.

---

## HP-5 — Observability: Error Reporting + Tracing

**Impact**: High

**Implementation steps**

1. Implement `LoggingService` remote transport (App Insights / Datadog / Sentry / OpenTelemetry).
2. Add correlation IDs:
   - generate on server and forward to client (or vice versa)
3. Ensure logs scrub:
   - tokens
   - passwords
   - email (if sensitive for your domain)

**Verification**

- Errors in production show up in the monitoring tool with stack traces.

---

## HP-6 — Document “Mock API” as a Development-Only Tool

**Impact**: High

**Implementation steps**

1. Make mock mode explicit:
   - guard the mock interceptor behind `!environment.production && environment.mockApiEnabled` (already done)
2. Add a README section:
   - how to disable mock mode
   - how to connect real API
3. Ensure demo credentials are never shipped as defaults.

**Verification**

- Production build does not include mock endpoints.

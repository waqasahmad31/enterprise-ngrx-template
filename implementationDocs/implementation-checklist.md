# Implementation Checklist — Make This a Reusable Production Boilerplate

Use this as an actionable, verifiable step-by-step guide. Check items off as you harden the template.

---

## A) Baseline Health (must be green)

- [ ] `npm ci` works from a clean checkout
- [ ] `npm run format:check` passes
- [ ] `npm run lint` passes
- [ ] `npm test` passes (headless)
- [ ] `npm run build` passes (production)
- [ ] `npm run e2e` passes (or is intentionally scoped to CI/nightly)

---

## B) Remove Demo/Template Artifacts

- [ ] Login form defaults are empty in production builds
- [ ] Demo credentials are not rendered unless explicitly in dev/demo mode
- [ ] Mock API is disabled in production builds and documented
- [ ] All “TODO integration points” are tracked as issues (logging/auth/etc.)

---

## C) Authentication & Authorization (production design)

- [ ] Pick an auth strategy (recommended: HttpOnly cookie session)
- [ ] Implement `/me` or `/session` endpoint integration
- [ ] Implement logout endpoint and client logout flow
- [ ] Implement refresh flow safely (single-flight refresh, one retry)
- [ ] Verify hard reload keeps session (if intended)
- [ ] Verify protected routes do not flicker or leak content
- [ ] Add e2e coverage for:
  - [ ] unauthenticated redirect
  - [ ] forbidden redirect
  - [ ] refresh-after-reload scenario

---

## D) Server-Side Rendering (SSR) Operations

- [ ] Add security headers (CSP, frame protections, etc.)
- [ ] Add rate limiting (global + auth routes)
- [ ] Add request size limits
- [ ] Add compression
- [ ] Add health endpoints (`/healthz`, `/readyz`)
- [ ] Add structured request logging with correlation/request IDs

---

## E) Security Hygiene

- [ ] Establish a “no secrets in the frontend” policy
- [ ] Confirm `public/config/app-config.json` contains **no secrets**
- [ ] Implement log scrubbing rules (tokens/passwords)
- [ ] Add dependency audit process:
  - [ ] `npm audit` policy (or SCA tool)
  - [ ] Renovate/Dependabot for controlled upgrades

---

## F) Environment & Configuration

- [ ] Add a staging environment profile
- [ ] Document configuration sources:
  - [ ] build-time environments
  - [ ] runtime config (public)
  - [ ] server env vars
- [ ] Ensure SSR and browser use consistent runtime config if it varies

---

## G) Performance

- [ ] Confirm lazy-loading is used for all major features
- [ ] Confirm preloading rules are intentional (`data.preload`)
- [ ] Define bundle budgets appropriate for your product
- [ ] Define table scalability strategy (server pagination vs virtual scroll)

---

## H) Accessibility & UX

- [ ] Run keyboard-only navigation test for all critical flows
- [ ] Validate headings/landmarks and ARIA labels
- [ ] Validate color contrast in both light/dark themes (if supported)
- [ ] Add automated a11y checks (optional but recommended)

---

## I) CI/CD

- [ ] Add CI workflow running the baseline health checks
- [ ] Add release artifact build step (SSR output)
- [ ] Add environment-based deployment strategy (dev/staging/prod)

---

## J) Template Reuse Workflow

- [ ] Document “How to fork/clone and rename” steps:
  - [ ] package name
  - [ ] app title/branding
  - [ ] environment variables
  - [ ] domain constants
- [ ] Provide a checklist for creating a new feature:
  - [ ] new folder under `src/app/features/<feature>`
  - [ ] lazy route
  - [ ] route-level providers for state
  - [ ] boundaries compliance

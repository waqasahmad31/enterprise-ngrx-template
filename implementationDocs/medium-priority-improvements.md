# Medium-Priority Improvements

These items improve code quality, UX polish, stability, and long-term maintainability. They are generally safe to schedule after critical/high-priority items.

---

## MP-1 — SSR + Runtime Config Consistency

**Problem**

- Runtime config (`/config/app-config.json`) is loaded only in the browser; SSR uses build defaults.

**Implementation steps**

1. If runtime config can differ between environments, introduce SSR-aware config:
   - load config on the server
   - inject it into the rendered HTML (TransferState or inline JSON)
   - hydrate using the same value on the client
2. Add a validation step:
   - ensure `apiBaseUrl` is a safe URL and not a secret

**Verification**

- No hydration mismatch when config differs.

---

## MP-2 — Strengthen Error Handling UX

Implementation steps

1. Provide an error component pattern:
   - feature-level error panel for recoverable API errors
   - global error page for fatal routing errors
2. Ensure `apiErrorInterceptor` does not toast spam:
   - dedupe repeated errors
   - map to user-friendly messages

Verification

- Burst of failing requests doesn’t produce dozens of snackbars.

---

## MP-3 — Improve Route Guards for Better UX

Implementation steps

1. Add “session restore” check to avoid redirect flicker:
   - an `AuthResolver` or bootstrap initializer that resolves auth state once
2. Ensure `permissionGuard` handles unknown permission sets gracefully.

Verification

- Navigating to a protected route during app startup behaves consistently.

---

## MP-4 — Data Table Scaling Strategy

Implementation steps

1. For large user lists, support one of:
   - server-side pagination/sorting/filtering
   - CDK virtual scroll
2. Make API contract explicit in `UsersApiService`.

Verification

- Performance remains smooth with 10k rows.

---

## MP-5 — Accessibility Hardening Checklist

Implementation steps

1. Keyboard-only walkthrough:
   - navigation
   - dialogs
   - search
2. Screen reader checks (NVDA/JAWS/VoiceOver):
   - ensure headings/landmarks make sense
3. Add automated checks:
   - Playwright + axe-core (optional)

Verification

- All key flows usable without a mouse.

---

## MP-6 — Testing Enhancements

Implementation steps

1. Add more unit tests for:
   - interceptors
   - facades
   - reducers/effects
2. Add e2e coverage for:
   - refresh token behavior (once implemented)
   - error page flows

Verification

- CI shows stable, non-flaky results.

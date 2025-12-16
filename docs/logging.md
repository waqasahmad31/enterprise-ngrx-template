# Logging

`LoggingService` (`src/app/core/logging/logging.service.ts`) provides a minimal structured logging API.

## Levels

- debug
- info
- warn
- error

Filtering:

- `environment.logging.level` sets minimum level.

## Output behavior

- In non-production: logs to console with a structured payload.
- In production: also logs to console (kept minimal) and provides a hook for remote logging.

## Extension points

- Add a remote transport (OpenTelemetry, AppInsights, Datadog, etc.) when `environment.logging.remoteLoggingEnabled` is true.

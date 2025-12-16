import { Injectable } from '@angular/core';

import type { LogContext } from './logging.service';
import type { LogLevel } from './log-level';

@Injectable({ providedIn: 'root' })
export class RemoteLoggingService {
  /**
   * Integration point for production observability.
   *
   * Replace this method body with your transport of choice (Sentry/AppInsights/Datadog/Otel).
   */
  send(level: LogLevel, message: string, context?: LogContext): void {
    // no-op default implementation
    void level;
    void message;
    void context;
  }
}

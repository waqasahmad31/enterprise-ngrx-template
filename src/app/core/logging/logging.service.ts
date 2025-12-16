import { Injectable } from '@angular/core';

import { environment } from '@env/environment';
import type { LogLevel } from './log-level';
import { LOG_LEVEL_ORDER } from './log-level';

export type LogContext = Record<string, unknown>;

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly minLevel: LogLevel = environment.logging.level;
  private readonly remoteEnabled = environment.logging.remoteLoggingEnabled;

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (LOG_LEVEL_ORDER[level] < LOG_LEVEL_ORDER[this.minLevel]) {
      return;
    }

    const payload = {
      level,
      message,
      context,
      ts: new Date().toISOString(),
    };

    if (!environment.production) {
      console[level === 'debug' ? 'log' : level](payload);
      return;
    }

    // In production, keep console noise down.
    console[level === 'debug' ? 'log' : level](payload);

    if (this.remoteEnabled) {
      // TODO: send to remote logging/observability system.
      // Example integration point: OpenTelemetry collector, Datadog, AppInsights, etc.
    }
  }
}

import { Injectable, inject } from '@angular/core';

import { environment } from '@env/environment';
import type { LogLevel } from './log-level';
import { LOG_LEVEL_ORDER } from './log-level';
import { RemoteLoggingService } from './remote-logging.service';

export type LogContext = Record<string, unknown>;

const SENSITIVE_KEYS = new Set(['password', 'accessToken', 'refreshToken', 'authorization']);

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private readonly minLevel: LogLevel = environment.logging.level;
  private readonly remoteEnabled = environment.logging.remoteLoggingEnabled;
  private readonly remote = inject(RemoteLoggingService);

  private scrub(value: unknown, seen = new WeakSet<object>()): unknown {
    if (value === null || value === undefined) return value;

    if (typeof value !== 'object') return value;

    if (seen.has(value)) return '[Circular]';
    seen.add(value);

    if (Array.isArray(value)) {
      return value.map((v) => this.scrub(v, seen));
    }

    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(obj)) {
      out[key] = SENSITIVE_KEYS.has(key) ? '[REDACTED]' : this.scrub(v, seen);
    }
    return out;
  }

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
      context: context ? (this.scrub(context) as LogContext) : undefined,
      ts: new Date().toISOString(),
    };

    if (!environment.production) {
      console[level === 'debug' ? 'log' : level](payload);
      return;
    }

    // In production, keep console noise down.
    console[level === 'debug' ? 'log' : level](payload);

    if (this.remoteEnabled) {
      this.remote.send(level, message, payload.context);
    }
  }
}

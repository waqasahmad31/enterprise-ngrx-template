import { ErrorHandler, Injectable, inject } from '@angular/core';

import { LoggingService } from '@core/logging/logging.service';
import { ToastService } from '@core/notifications/toast.service';
import { APP_MESSAGES } from '@domain/constants/app-messages';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly logger = inject(LoggingService);
  private readonly toasts = inject(ToastService);

  handleError(error: unknown): void {
    const message = error instanceof Error ? error.message : 'Unexpected error';

    this.logger.error('Unhandled error', {
      message,
      error,
    });

    try {
      this.toasts.error(APP_MESSAGES.errors.unexpectedUserMessage, APP_MESSAGES.errors.errorTitle);
    } catch {
      // If notifications fail (e.g., overlay issues), avoid infinite error loops.
    }

    // Re-throwing is not desirable in most SPA contexts; leave it logged.
  }
}

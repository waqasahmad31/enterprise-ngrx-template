import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { LoggingService } from '@core/logging/logging.service';
import { ToastService } from '@core/notifications/toast.service';
import { APP_MESSAGES } from '@domain/constants/app-messages';
import { mapHttpError } from './http-error.mapper';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggingService);
  const toasts = inject(ToastService);

  return next(req).pipe(
    catchError((err: unknown) => {
      const appError = mapHttpError(err);

      logger.error('HTTP error', {
        url: req.url,
        method: req.method,
        appError,
      });

      if (appError.code !== 'UNAUTHORIZED') {
        toasts.error(appError.message, APP_MESSAGES.http.requestFailedTitle);
      }

      return throwError(() => err);
    }),
  );
};

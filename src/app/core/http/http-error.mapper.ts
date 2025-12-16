import { HttpErrorResponse } from '@angular/common/http';

import type { AppError } from '@domain/errors/app-error';

export const mapHttpError = (err: unknown): AppError => {
  if (!(err instanceof HttpErrorResponse)) {
    return { code: 'UNKNOWN', message: 'Unexpected error', details: err };
  }

  const status = err.status;

  if (status === 0) {
    return { code: 'NETWORK', message: 'Network error', status };
  }

  if (status === 401) {
    return { code: 'UNAUTHORIZED', message: 'Unauthorized', status };
  }

  if (status === 403) {
    return { code: 'FORBIDDEN', message: 'Forbidden', status };
  }

  if (status === 404) {
    return { code: 'NOT_FOUND', message: 'Not found', status };
  }

  if (status === 400) {
    return { code: 'VALIDATION', message: 'Invalid request', status, details: err.error };
  }

  return {
    code: 'UNKNOWN',
    message: err.message || 'Unexpected error',
    status,
    details: err.error,
  };
};

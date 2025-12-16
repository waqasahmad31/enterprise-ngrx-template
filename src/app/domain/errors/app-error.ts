export type AppErrorCode =
  | 'NETWORK'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'UNKNOWN';

export interface AppError {
  code: AppErrorCode;
  message: string;
  status?: number;
  details?: unknown;
  correlationId?: string;
}

export const unknownError = (message = 'Unexpected error'): AppError => ({
  code: 'UNKNOWN',
  message,
});

import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { LoggingService } from '@core/logging/logging.service';
import { ToastService } from '@core/notifications/toast.service';
import { APP_MESSAGES } from '@domain/constants/app-messages';

import { GlobalErrorHandler } from './global-error-handler';

describe('GlobalErrorHandler', () => {
  const loggerMock: Pick<LoggingService, 'error'> = {
    error: vi.fn(),
  } as any;

  const toastsMock: Pick<ToastService, 'error'> = {
    error: vi.fn(),
  } as any;

  let handler: GlobalErrorHandler;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandler,
        { provide: LoggingService, useValue: loggerMock },
        { provide: ToastService, useValue: toastsMock },
      ],
    });

    handler = TestBed.inject(GlobalErrorHandler);
  });

  it('logs the error and shows a generic toast message', () => {
    const error = new Error('Boom');

    handler.handleError(error);

    expect(loggerMock.error).toHaveBeenCalledTimes(1);
    expect(loggerMock.error).toHaveBeenCalledWith('Unhandled error', {
      message: 'Boom',
      error,
    });

    expect(toastsMock.error).toHaveBeenCalledTimes(1);
    expect(toastsMock.error).toHaveBeenCalledWith(
      APP_MESSAGES.errors.unexpectedUserMessage,
      APP_MESSAGES.errors.errorTitle,
    );
  });

  it('handles non-Error values gracefully', () => {
    const unknownError = { foo: 'bar' };

    handler.handleError(unknownError as unknown as Error);

    expect(loggerMock.error).toHaveBeenCalledTimes(1);
    expect(toastsMock.error).toHaveBeenCalledTimes(1);
  });
});

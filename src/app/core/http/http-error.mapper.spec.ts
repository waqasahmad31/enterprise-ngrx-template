import { HttpErrorResponse } from '@angular/common/http';

import { mapHttpError } from './http-error.mapper';

describe('mapHttpError', () => {
  it('maps 404 to NOT_FOUND', () => {
    const err = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
    expect(mapHttpError(err)).toEqual({
      code: 'NOT_FOUND',
      message: 'Not found',
      status: 404,
    });
  });

  it('maps status 0 to NETWORK', () => {
    const err = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    expect(mapHttpError(err)).toEqual({
      code: 'NETWORK',
      message: 'Network error',
      status: 0,
    });
  });
});

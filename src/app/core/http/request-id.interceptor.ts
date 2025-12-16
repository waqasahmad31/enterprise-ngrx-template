import { type HttpInterceptorFn } from '@angular/common/http';

import { HTTP_HEADERS } from '@domain/constants/http-headers';

const makeRequestId = (): string => {
  const cryptoObj = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  return `req_${Math.random().toString(16).slice(2)}${Date.now()}`;
};

export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has(HTTP_HEADERS.requestId)) {
    return next(req);
  }

  const requestId = makeRequestId();
  return next(req.clone({ setHeaders: { [HTTP_HEADERS.requestId]: requestId } }));
};

import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { AuthService } from '@core/auth/auth.service';

import { API_PATHS, HTTP_HEADERS } from '@domain/constants';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const accessToken = auth.accessToken;
  const isAuthEndpoint =
    req.url.includes(API_PATHS.auth.login) ||
    req.url.includes(API_PATHS.auth.refresh) ||
    req.url.includes(API_PATHS.auth.logout) ||
    req.url.includes(API_PATHS.auth.csrf) ||
    req.url.includes(API_PATHS.auth.me);

  const withAuth =
    accessToken && !isAuthEndpoint
      ? req.clone({ setHeaders: { [HTTP_HEADERS.authorization]: `Bearer ${accessToken}` } })
      : req;

  return next(withAuth).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) {
        return throwError(() => err);
      }

      if (err.status !== 401) {
        return throwError(() => err);
      }

      if (withAuth.headers.has(HTTP_HEADERS.skipAuthRefresh) || isAuthEndpoint) {
        return throwError(() => err);
      }

      const refresh$ = accessToken
        ? from(auth.refreshTokens()).pipe(
            switchMap((tokens) => {
              if (!tokens?.accessToken) {
                auth.logout();
                return throwError(() => err);
              }

              const retried = withAuth.clone({
                setHeaders: {
                  [HTTP_HEADERS.authorization]: `Bearer ${tokens.accessToken}`,
                  [HTTP_HEADERS.skipAuthRefresh]: '1',
                },
              });

              return next(retried);
            }),
          )
        : from(auth.refreshCookieSession()).pipe(
            switchMap((ok) => {
              if (!ok) {
                auth.logout();
                return throwError(() => err);
              }

              const retried = withAuth.clone({
                setHeaders: {
                  [HTTP_HEADERS.skipAuthRefresh]: '1',
                },
              });

              return next(retried);
            }),
          );

      return refresh$;
    }),
  );
};

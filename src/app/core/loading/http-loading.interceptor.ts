import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { LoadingService } from './loading.service';

export const httpLoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);

  loading.beginHttp();
  return next(req).pipe(finalize(() => loading.endHttp()));
};

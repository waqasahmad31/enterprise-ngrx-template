import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';

import { APP_ROUTES } from '@domain/constants';

import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.init().then(() => {
    if (auth.isAuthenticated) {
      return true;
    }

    return router.createUrlTree([APP_ROUTES.auth.login], {
      queryParams: { returnUrl: state.url },
    });
  });
};

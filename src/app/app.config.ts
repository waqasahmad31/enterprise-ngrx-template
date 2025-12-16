import {
  provideHttpClient,
  withFetch,
  withInterceptors,
  withXsrfConfiguration,
} from '@angular/common/http';
import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter, withPreloading } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { environment } from '@env/environment';

import { HTTP_HEADERS } from '@domain/constants';

import { provideAppConfigInitializer } from '@core/config/app-config.initializer';
import { AuthService } from '@core/auth/auth.service';
import { GlobalErrorHandler } from '@core/error/global-error-handler';
import { apiErrorInterceptor } from '@core/http/api-error.interceptor';
import { authTokenInterceptor } from '@core/http/auth-token.interceptor';
import { mockApiInterceptor } from '@core/http/mock-api.interceptor';
import { httpLoadingInterceptor } from '@core/loading/http-loading.interceptor';
import { NavigationLoadingService } from '@core/loading/navigation-loading.service';
import { SelectivePreloadingStrategy } from '@core/routing/selective-preloading-strategy';
import { ThemeModeService } from '@core/theme/theme-mode.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    importProvidersFrom(MatSnackBarModule, MatDialogModule),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(SelectivePreloadingStrategy)),
    provideHttpClient(
      withFetch(),
      withXsrfConfiguration({
        cookieName: HTTP_HEADERS.xsrfCookie,
        headerName: HTTP_HEADERS.xsrfHeader,
      }),
      withInterceptors([
        httpLoadingInterceptor,
        authTokenInterceptor,
        ...(environment.production || !environment.mockApiEnabled ? [] : [mockApiInterceptor]),
        apiErrorInterceptor,
      ]),
    ),
    provideClientHydration(withEventReplay()),

    // Eagerly instantiate router-loading listener.
    NavigationLoadingService,

    // NgRx root (feature state is provided at route level per feature).
    provideStore(),
    provideEffects(),
    ...(isDevMode() ? [provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })] : []),

    // Runtime config (optional): loads public/config/app-config.json at startup.
    provideAppConfigInitializer(),

    // Restore session (dev/mock mode only).
    provideAppInitializer(() => inject(AuthService).init()),

    // Apply initial theme mode ASAP (SSR-safe).
    provideAppInitializer(() => {
      inject(ThemeModeService).init();
    }),

    // Global error handling.
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};

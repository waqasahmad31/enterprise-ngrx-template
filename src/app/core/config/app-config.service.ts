import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { environment } from '@env/environment';
import type { RuntimeAppConfig } from './app-config.model';

const DEFAULT_RUNTIME_CONFIG: RuntimeAppConfig = {
  apiBaseUrl: environment.apiBaseUrl,
  featureFlags: environment.featureFlags,
};

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _config = signal<RuntimeAppConfig>(DEFAULT_RUNTIME_CONFIG);
  readonly config = this._config.asReadonly();

  async load(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      this._config.set(DEFAULT_RUNTIME_CONFIG);
      return;
    }

    try {
      const runtime = await firstValueFrom(
        this.http.get<Partial<RuntimeAppConfig>>('/config/app-config.json', {
          headers: { 'Cache-Control': 'no-cache' },
        }),
      );

      this._config.set({
        ...DEFAULT_RUNTIME_CONFIG,
        ...runtime,
        featureFlags: {
          ...DEFAULT_RUNTIME_CONFIG.featureFlags,
          ...(runtime.featureFlags ?? {}),
        },
      });
    } catch {
      // Runtime config is optional; app can boot using build-time defaults.
      this._config.set(DEFAULT_RUNTIME_CONFIG);
    }
  }
}

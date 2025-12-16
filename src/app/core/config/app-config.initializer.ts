import { APP_INITIALIZER, type Provider } from '@angular/core';

import { AppConfigService } from './app-config.service';

export const provideAppConfigInitializer = (): Provider => ({
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: (config: AppConfigService) => () => config.load(),
  deps: [AppConfigService],
});

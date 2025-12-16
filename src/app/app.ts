import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoadingService } from '@core/loading/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, MatProgressBarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly loadingService = inject(LoadingService);

  readonly loading$ = this.loadingService.loading$;
  readonly isBrowser = isPlatformBrowser(this.platformId);
}

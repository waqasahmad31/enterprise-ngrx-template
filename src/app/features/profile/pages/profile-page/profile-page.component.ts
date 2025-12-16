import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@core/auth/auth.service';
import { ThemeModeService } from '@core/theme/theme-mode.service';
import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    AsyncPipe,
    PageHeaderComponent,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  private readonly auth = inject(AuthService);
  private readonly themeMode = inject(ThemeModeService);

  readonly user$ = this.auth.user$;
  readonly themeModeSignal = this.themeMode.mode;

  toggleTheme(): void {
    this.themeMode.toggle();
  }

  logout(): void {
    this.auth.logout();
  }
}

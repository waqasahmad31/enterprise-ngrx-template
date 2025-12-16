import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  private readonly fb = inject(NonNullableFormBuilder);

  readonly timezones = ['UTC', 'Asia/Karachi', 'Europe/London', 'America/New_York'] as const;

  readonly form = this.fb.group({
    orgName: this.fb.control('Acme Inc.', [Validators.required]),
    timezone: this.fb.control<'UTC' | 'Asia/Karachi' | 'Europe/London' | 'America/New_York'>('UTC'),
    supportEmail: this.fb.control('support@acme.test', [Validators.required, Validators.email]),
    emailReports: this.fb.control(true),
    maintenanceMode: this.fb.control(false),
  });
}

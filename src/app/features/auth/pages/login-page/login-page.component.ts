import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { AuthService } from '@core/auth/auth.service';
import { AppConfigService } from '@core/config/app-config.service';
import { ToastService } from '@core/notifications/toast.service';
import { APP_MESSAGES, APP_ROUTES } from '@domain/constants';
import { environment } from '@env/environment';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toasts = inject(ToastService);
  private readonly config = inject(AppConfigService);

  submitting = false;
  hidePassword = true;
  readonly matcher = new TouchedErrorStateMatcher();

  readonly form = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
    password: this.fb.nonNullable.control('', [Validators.required]),
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    const { email, password } = this.form.getRawValue();

    try {
      const ok = await this.auth.login({ email, password });
      if (ok) {
        this.toasts.success(APP_MESSAGES.auth.welcomeBack);
        await this.router.navigateByUrl(APP_ROUTES.dashboard);
      }
    } finally {
      this.submitting = false;
    }
  }

  signInWithGoogle(): void {
    // UI is production-ready; real OAuth requires a backend endpoint.
    if (!environment.production) {
      this.toasts.info('Google sign-in is not available in mock mode.');
      return;
    }

    const baseUrl = this.config.config().apiBaseUrl;
    globalThis.location.assign(`${baseUrl}/auth/google`);
  }
}

class TouchedErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl<unknown> | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = !!form?.submitted;
    return !!(control && control.invalid && (control.touched || isSubmitted));
  }
}

import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import type { User } from '@domain/users/user.model';
import { APP_ROUTES } from '@domain/constants';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

import { UsersFacade } from '../../data-access/users.facade';

@Component({
  selector: 'app-user-edit-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './user-edit-page.component.html',
  styleUrl: './user-edit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserEditPageComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly facade = inject(UsersFacade);

  private userId: string | null = null;

  readonly form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    firstName: this.fb.control('', [Validators.required]),
    lastName: this.fb.control('', [Validators.required]),
    isActive: this.fb.control(true),
  });

  get isEdit(): boolean {
    return !!this.userId;
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    const resolved = this.route.snapshot.data['user'] as User | undefined;

    if (resolved) {
      this.form.reset({
        email: resolved.email,
        firstName: resolved.firstName,
        lastName: resolved.lastName,
        isActive: resolved.isActive,
      });
    }
  }

  cancel(): void {
    void this.router.navigateByUrl(
      this.userId ? APP_ROUTES.users.details(this.userId) : APP_ROUTES.users.root,
    );
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    if (this.userId) {
      this.facade.updateUser(this.userId, payload);
    } else {
      this.facade.createUser(payload);
    }
  }
}

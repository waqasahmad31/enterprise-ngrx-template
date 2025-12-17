import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import type { ToastType } from '../toast.models';

export interface ToastSnackData {
  type: ToastType;
  title?: string;
  message: string;
}

@Component({
  selector: 'app-toast-snack',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="toast">
      <mat-icon class="toast-icon" aria-hidden="true">{{ icon() }}</mat-icon>

      <div class="toast-body">
        @if (data.title) {
          <div class="toast-title">{{ data.title }}</div>
        }
        <div class="toast-message">{{ data.message }}</div>
      </div>

      <button mat-icon-button type="button" aria-label="Dismiss" (click)="dismiss()">
        <mat-icon aria-hidden="true">close</mat-icon>
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastSnackComponent {
  readonly data = inject<ToastSnackData>(MAT_SNACK_BAR_DATA);
  private readonly ref = inject(MatSnackBarRef<ToastSnackComponent>);

  readonly icon = computed(() => {
    const type = this.data.type;
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  });

  dismiss(): void {
    this.ref.dismiss();
  }
}

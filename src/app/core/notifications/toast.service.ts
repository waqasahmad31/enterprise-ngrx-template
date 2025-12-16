import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import type { ToastType } from './toast.models';

const DEFAULT_DURATION_MS: Record<ToastType, number> = {
  success: 3000,
  info: 3500,
  warning: 4500,
  error: 6000,
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly snackBar = inject(MatSnackBar);

  success(message: string, title?: string): void {
    this.show('success', message, title);
  }

  info(message: string, title?: string): void {
    this.show('info', message, title);
  }

  warning(message: string, title?: string): void {
    this.show('warning', message, title);
  }

  error(message: string, title?: string): void {
    this.show('error', message, title);
  }

  private show(type: ToastType, message: string, title?: string): void {
    // Snackbars require DOM APIs; no-op during SSR.
    if (!isPlatformBrowser(this.platformId)) return;

    const text = title ? `${title}: ${message}` : message;
    this.snackBar.open(text, 'Dismiss', {
      duration: DEFAULT_DURATION_MS[type],
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [`toast-${type}`],
    });
  }
}

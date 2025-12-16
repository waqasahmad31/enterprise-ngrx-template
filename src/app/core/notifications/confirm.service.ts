import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

export interface ConfirmOptions {
  header?: string;
  message: string;
  acceptLabel?: string;
  rejectLabel?: string;
  accept?: () => void;
  reject?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly dialog = inject(MatDialog);

  confirm(options: ConfirmOptions): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.header,
        message: options.message,
        confirmText: options.acceptLabel,
        cancelText: options.rejectLabel,
      },
      autoFocus: false,
      restoreFocus: true,
    });

    ref.afterClosed().subscribe((ok) => {
      if (ok) {
        options.accept?.();
      } else {
        options.reject?.();
      }
    });
  }

  confirmDelete(entityLabel: string, accept: () => void): void {
    this.confirm({
      header: 'Confirm delete',
      message: `Delete this ${entityLabel}? This action cannot be undone.`,
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept,
    });
  }
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  createdAtEpochMs: number;
  durationMs: number;
}

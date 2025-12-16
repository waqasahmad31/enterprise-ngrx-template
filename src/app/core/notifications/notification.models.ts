export type NotificationSeverity = 'info' | 'success' | 'warn' | 'danger';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  createdAtEpochMs: number;
  readAtEpochMs?: number;
  link?: string;
}

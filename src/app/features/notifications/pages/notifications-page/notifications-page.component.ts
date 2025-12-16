import { AsyncPipe, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { NotificationCenterService } from '@core/notifications/notification-center.service';
import type { NotificationSeverity } from '@core/notifications/notification.models';
import type { AppNotification } from '@core/notifications/notification.models';
import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    PageHeaderComponent,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './notifications-page.component.html',
  styleUrl: './notifications-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsPageComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly center = inject(NotificationCenterService);

  readonly items$ = this.center.items$;
  readonly unreadCount$ = this.center.unreadCount$;

  readonly hasItems$ = this.items$.pipe(map((items) => items.length > 0));

  readonly displayedColumns = ['title', 'severity', 'created', 'actions'] as const;
  readonly dataSource = new MatTableDataSource<AppNotification>([]);

  @ViewChild(MatPaginator) paginator?: MatPaginator;

  constructor() {
    this.items$.pipe(takeUntilDestroyed()).subscribe((items) => {
      this.dataSource.data = items;
    });
  }

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  severityColor(severity: NotificationSeverity): 'primary' | 'warn' {
    return severity === 'warn' ? 'warn' : 'primary';
  }

  open(id: string, link?: string): void {
    this.center.markRead(id);
    if (link) void this.router.navigateByUrl(link);
  }

  markAllRead(): void {
    this.center.markAllRead();
  }

  clear(): void {
    this.center.clear();
  }
}

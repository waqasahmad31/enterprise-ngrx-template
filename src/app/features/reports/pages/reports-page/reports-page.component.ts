import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

interface ReportRow {
  id: string;
  name: string;
  owner: string;
  schedule: string;
  status: 'Ready' | 'Running' | 'Failed';
  lastRunIso: string;
}

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [
    DatePipe,
    PageHeaderComponent,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPageComponent {
  readonly displayedColumns = [
    'name',
    'owner',
    'schedule',
    'status',
    'lastRun',
    'actions',
  ] as const;

  readonly reports: ReportRow[] = [
    {
      id: 'r_1',
      name: 'Daily active users',
      owner: 'Analytics',
      schedule: 'Daily 08:00',
      status: 'Ready',
      lastRunIso: new Date(Date.now() - 6 * 60 * 60_000).toISOString(),
    },
    {
      id: 'r_2',
      name: 'Access review',
      owner: 'Security',
      schedule: 'Weekly Mon',
      status: 'Running',
      lastRunIso: new Date(Date.now() - 30 * 60_000).toISOString(),
    },
    {
      id: 'r_3',
      name: 'Billing summary',
      owner: 'Finance',
      schedule: 'Monthly',
      status: 'Failed',
      lastRunIso: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(),
    },
  ];

  statusColor(status: ReportRow['status']): 'primary' | 'warn' {
    if (status === 'Failed') return 'warn';
    return 'primary';
  }
}

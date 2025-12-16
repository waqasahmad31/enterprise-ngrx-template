import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

interface AuditRow {
  id: string;
  atIso: string;
  actor: string;
  action: string;
  resource: string;
  severity: 'info' | 'warn' | 'danger';
}

@Component({
  selector: 'app-audit-page',
  standalone: true,
  imports: [
    DatePipe,
    PageHeaderComponent,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatChipsModule,
  ],
  templateUrl: './audit-page.component.html',
  styleUrl: './audit-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditPageComponent implements AfterViewInit {
  @ViewChild(MatPaginator) private readonly paginator?: MatPaginator;

  readonly displayedColumns: (keyof Pick<
    AuditRow,
    'atIso' | 'actor' | 'action' | 'resource' | 'severity'
  >)[] = ['atIso', 'actor', 'action', 'resource', 'severity'];

  readonly rows: AuditRow[] = [
    {
      id: 'a_1',
      atIso: new Date(Date.now() - 5 * 60_000).toISOString(),
      actor: 'Ada Admin',
      action: 'USER_CREATED',
      resource: 'User u_3',
      severity: 'info',
    },
    {
      id: 'a_2',
      atIso: new Date(Date.now() - 60 * 60_000).toISOString(),
      actor: 'System',
      action: 'TOKEN_REFRESH',
      resource: 'Session',
      severity: 'info',
    },
    {
      id: 'a_3',
      atIso: new Date(Date.now() - 2 * 24 * 60 * 60_000).toISOString(),
      actor: 'Security',
      action: 'POLICY_VIOLATION',
      resource: 'Access review',
      severity: 'warn',
    },
  ];

  readonly dataSource = new MatTableDataSource<AuditRow>(this.rows);

  ngAfterViewInit(): void {
    if (this.paginator) this.dataSource.paginator = this.paginator;
  }

  severityColor(severity: AuditRow['severity']): 'primary' | 'warn' | undefined {
    if (severity === 'danger') return 'warn';
    if (severity === 'warn') return 'warn';
    return 'primary';
  }
}

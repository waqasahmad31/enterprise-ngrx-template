import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

interface TicketRow {
  id: string;
  subject: string;
  status: 'Open' | 'In progress' | 'Closed';
  updatedIso: string;
}

@Component({
  selector: 'app-support-page',
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
  templateUrl: './support-page.component.html',
  styleUrl: './support-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportPageComponent {
  readonly displayedColumns: (
    | keyof Pick<TicketRow, 'id' | 'subject' | 'status' | 'updatedIso'>
    | 'actions'
  )[] = ['id', 'subject', 'status', 'updatedIso', 'actions'];

  readonly tickets: TicketRow[] = [
    {
      id: 'TCK-1041',
      subject: 'Unable to invite new team member',
      status: 'Open',
      updatedIso: new Date(Date.now() - 15 * 60_000).toISOString(),
    },
    {
      id: 'TCK-1033',
      subject: 'Billing invoice missing VAT number',
      status: 'In progress',
      updatedIso: new Date(Date.now() - 4 * 60 * 60_000).toISOString(),
    },
    {
      id: 'TCK-1010',
      subject: 'Login audit export request',
      status: 'Closed',
      updatedIso: new Date(Date.now() - 7 * 24 * 60 * 60_000).toISOString(),
    },
  ];

  statusColor(status: TicketRow['status']): 'primary' | 'warn' | undefined {
    if (status === 'Closed') return 'primary';
    if (status === 'In progress') return undefined;
    return 'warn';
  }

  statusSeverity(status: TicketRow['status']): 'success' | 'info' | 'warn' {
    if (status === 'Closed') return 'success';
    if (status === 'In progress') return 'info';
    return 'warn';
  }
}

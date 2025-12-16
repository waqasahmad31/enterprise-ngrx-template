import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

interface InvoiceRow {
  id: string;
  dateIso: string;
  amount: string;
  status: 'Paid' | 'Open' | 'Overdue';
}

@Component({
  selector: 'app-billing-page',
  standalone: true,
  imports: [
    DatePipe,
    PageHeaderComponent,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './billing-page.component.html',
  styleUrl: './billing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingPageComponent {
  readonly displayedColumns: (
    | keyof Pick<InvoiceRow, 'id' | 'dateIso' | 'amount' | 'status'>
    | 'actions'
  )[] = ['id', 'dateIso', 'amount', 'status', 'actions'];

  readonly plan = {
    name: 'Business',
    renewalIso: new Date(Date.now() + 10 * 24 * 60 * 60_000).toISOString(),
    seats: 25,
  };

  readonly invoices: InvoiceRow[] = [
    {
      id: 'inv_1001',
      dateIso: new Date(Date.now() - 24 * 60 * 60_000).toISOString(),
      amount: '$2,000',
      status: 'Paid',
    },
    {
      id: 'inv_1002',
      dateIso: new Date(Date.now() - 32 * 24 * 60 * 60_000).toISOString(),
      amount: '$2,000',
      status: 'Paid',
    },
    {
      id: 'inv_1003',
      dateIso: new Date(Date.now() - 63 * 24 * 60 * 60_000).toISOString(),
      amount: '$2,000',
      status: 'Open',
    },
  ];

  statusColor(status: InvoiceRow['status']): 'primary' | 'warn' | undefined {
    if (status === 'Paid') return 'primary';
    if (status === 'Open') return undefined;
    return 'warn';
  }

  statusSeverity(status: InvoiceRow['status']): 'success' | 'info' | 'warn' | 'danger' {
    if (status === 'Paid') return 'success';
    if (status === 'Open') return 'info';
    return 'danger';
  }
}

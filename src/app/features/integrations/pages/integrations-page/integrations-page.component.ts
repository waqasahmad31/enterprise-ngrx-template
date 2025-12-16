import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

interface IntegrationRow {
  id: string;
  name: string;
  category: string;
  status: 'Connected' | 'Disconnected';
}

@Component({
  selector: 'app-integrations-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './integrations-page.component.html',
  styleUrl: './integrations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntegrationsPageComponent {
  readonly displayedColumns = ['name', 'category', 'status', 'actions'] as const;

  readonly integrations: IntegrationRow[] = [
    { id: 'int_1', name: 'Slack', category: 'Chat', status: 'Connected' },
    { id: 'int_2', name: 'GitHub', category: 'SCM', status: 'Connected' },
    { id: 'int_3', name: 'PagerDuty', category: 'On-call', status: 'Disconnected' },
  ];

  statusColor(s: IntegrationRow['status']): 'primary' | 'warn' {
    return s === 'Connected' ? 'primary' : 'warn';
  }
}

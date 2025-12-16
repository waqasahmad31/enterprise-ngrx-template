import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

interface TeamRow {
  id: string;
  name: string;
  members: number;
  visibility: 'Private' | 'Public';
}

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './teams-page.component.html',
  styleUrl: './teams-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamsPageComponent {
  readonly displayedColumns = ['name', 'members', 'visibility', 'actions'] as const;

  readonly teams: TeamRow[] = [
    { id: 't_1', name: 'Platform', members: 9, visibility: 'Private' },
    { id: 't_2', name: 'Security', members: 4, visibility: 'Private' },
    { id: 't_3', name: 'Customer Success', members: 12, visibility: 'Public' },
  ];

  visibilityColor(v: TeamRow['visibility']): 'primary' | 'warn' {
    return v === 'Public' ? 'primary' : 'warn';
  }
}

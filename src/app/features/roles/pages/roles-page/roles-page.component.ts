import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

interface RoleRow {
  id: string;
  name: string;
  level: 'Admin' | 'Standard' | 'Read-only';
  permissions: string[];
}

@Component({
  selector: 'app-roles-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolesPageComponent {
  readonly displayedColumns = ['name', 'level', 'permissions', 'actions'] as const;

  readonly roles: RoleRow[] = [
    {
      id: 'role_admin',
      name: 'Admin',
      level: 'Admin',
      permissions: ['users.read', 'users.write', 'settings.read', 'settings.write'],
    },
    {
      id: 'role_user',
      name: 'User',
      level: 'Standard',
      permissions: ['users.read', 'settings.read'],
    },
    {
      id: 'role_viewer',
      name: 'Viewer',
      level: 'Read-only',
      permissions: ['users.read'],
    },
  ];

  levelColor(level: RoleRow['level']): 'primary' | 'warn' {
    return level === 'Admin' ? 'warn' : 'primary';
  }
}

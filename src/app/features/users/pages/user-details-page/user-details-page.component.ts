import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import type { User } from '@domain/users/user.model';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-user-details-page',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterLink,
    AsyncPipe,
    DatePipe,
  ],
  templateUrl: './user-details-page.component.html',
  styleUrl: './user-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly user$ = this.route.data.pipe(map((d) => d['user'] as User));

  statusColor(isActive: boolean): 'primary' | 'warn' {
    return isActive ? 'primary' : 'warn';
  }
}

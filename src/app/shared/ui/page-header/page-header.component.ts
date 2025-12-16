import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import type { PageBreadcrumb } from './page-header.models';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input() breadcrumbs?: PageBreadcrumb[];
}

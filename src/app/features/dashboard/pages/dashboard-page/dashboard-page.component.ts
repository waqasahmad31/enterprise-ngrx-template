import { ChangeDetectionStrategy, Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [PageHeaderComponent, MatCardModule, MatChipsModule, MatIconModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  readonly kpis = [
    {
      label: 'Active users',
      value: '1,284',
      icon: 'group',
      badge: { value: '+3.1%', severity: 'success' as const },
    },
    {
      label: 'Requests (24h)',
      value: '18.2k',
      icon: 'bolt',
      badge: { value: '+0.8%', severity: 'info' as const },
    },
    {
      label: 'Incidents',
      value: '0',
      icon: 'check_circle',
      badge: { value: 'Healthy', severity: 'success' as const },
    },
    {
      label: 'Uptime',
      value: '99.99%',
      icon: 'schedule',
      badge: { value: 'SLA', severity: 'info' as const },
    },
  ] as const;

  readonly recent = [
    { title: 'Users synced', subtitle: 'Mock API • just now' },
    { title: 'Settings updated', subtitle: 'Audit log • 1h ago' },
    { title: 'Deployment completed', subtitle: 'CI/CD • yesterday' },
  ] as const;

  readonly trafficLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] as const;
  readonly trafficValues = [1200, 2400, 5200, 7800, 6100, 4200] as const;

  readonly trafficPath = this.buildLinePath(this.trafficValues, 600, 260, 16);

  badgeColor(severity: 'success' | 'info'): 'primary' | undefined {
    if (severity === 'success') return 'primary';
    return undefined;
  }

  private buildLinePath(
    values: readonly number[],
    width: number,
    height: number,
    padding: number,
  ): string {
    if (!values.length) return '';

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);

    const innerW = Math.max(1, width - padding * 2);
    const innerH = Math.max(1, height - padding * 2);
    const step = values.length > 1 ? innerW / (values.length - 1) : 0;

    return values
      .map((v, i) => {
        const x = padding + i * step;
        const t = (v - min) / range;
        const y = padding + (1 - t) * innerH;
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(' ');
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-access-denied-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './access-denied-page.component.html',
  styleUrl: './access-denied-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedPageComponent {}

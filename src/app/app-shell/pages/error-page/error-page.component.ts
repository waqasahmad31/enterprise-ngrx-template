import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageComponent {}

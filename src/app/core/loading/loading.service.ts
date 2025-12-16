import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private httpCount = 0;
  private navCount = 0;

  private readonly _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable();

  beginHttp(): void {
    this.httpCount++;
    this.emit();
  }

  endHttp(): void {
    this.httpCount = Math.max(0, this.httpCount - 1);
    this.emit();
  }

  beginNavigation(): void {
    this.navCount++;
    this.emit();
  }

  endNavigation(): void {
    this.navCount = Math.max(0, this.navCount - 1);
    this.emit();
  }

  private emit(): void {
    this._loading.next(this.httpCount + this.navCount > 0);
  }
}

import { Injectable } from '@angular/core';
import { Route, type PreloadingStrategy } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const shouldPreload = route.data?.['preload'] === true;
    return shouldPreload ? load() : of(null);
  }
}

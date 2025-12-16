import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class BrowserStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getJson<T>(key: string): T | null {
    if (!this.isBrowser) return null;

    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  setJson(key: string, value: unknown): void {
    if (!this.isBrowser) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  remove(key: string): void {
    if (!this.isBrowser) return;

    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}

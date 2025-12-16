import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

import { STORAGE_KEYS } from '@domain/constants';

import { BrowserStorageService } from '@core/platform/browser-storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeModeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(BrowserStorageService);

  readonly mode = signal<ThemeMode>('light');

  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const stored = this.storage.getJson<ThemeMode>(STORAGE_KEYS.themeMode);
    const initial = this.normalizeMode(stored) ?? this.getSystemPreferredMode();

    this.setMode(initial, { persist: false });
  }

  toggle(): void {
    const next: ThemeMode = this.mode() === 'dark' ? 'light' : 'dark';
    this.setMode(next);
  }

  setMode(mode: ThemeMode, options?: { persist?: boolean }): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const persist = options?.persist ?? true;
    const normalized = this.normalizeMode(mode) ?? 'light';

    this.mode.set(normalized);
    this.applyToDom(normalized);

    if (persist) {
      this.storage.setJson(STORAGE_KEYS.themeMode, normalized);
    }
  }

  private applyToDom(mode: ThemeMode): void {
    const root = this.document?.documentElement;
    if (!root) return;

    root.classList.toggle('app-dark', mode === 'dark');
    root.style.colorScheme = mode;
  }

  private normalizeMode(value: unknown): ThemeMode | null {
    return value === 'light' || value === 'dark' ? value : null;
  }

  private getSystemPreferredMode(): ThemeMode {
    try {
      return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  }
}

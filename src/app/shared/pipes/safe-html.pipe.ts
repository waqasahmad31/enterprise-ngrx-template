import { Pipe, PipeTransform, SecurityContext, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Prefer sanitizing untrusted HTML rather than bypassing security.
 * If you must bypass, wrap it in a clearly documented helper and keep it localized.
 */
@Pipe({ name: 'safeHtml', standalone: true })
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) ?? '';
  }
}

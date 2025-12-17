import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

const applyGlobalTypography = (): void => {
	// Browser-only; SSR will render without touching `document`.
	const root = globalThis.document?.documentElement;
	if (!root) return;

	root.classList.toggle('app-prod', Boolean(environment.production));

	const t = environment.typography;
	if (!t) return;

	root.style.setProperty('--app-font-family', t.fontFamily);
	root.style.setProperty('--app-font-size', `${t.baseFontSizePx}px`);
	root.style.setProperty('--app-line-height', String(t.lineHeight));
	root.style.setProperty('--app-font-weight-regular', String(t.weightRegular));
	root.style.setProperty('--app-font-weight-medium', String(t.weightMedium));
	root.style.setProperty('--app-font-weight-semibold', String(t.weightSemibold));
};

applyGlobalTypography();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

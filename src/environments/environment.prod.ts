export const environment = {
  production: true,
  apiBaseUrl: '/api',
  typography: {
    fontFamily:
      "Roboto, system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
    baseFontSizePx: 16,
    lineHeight: 1.5,
    weightRegular: 400,
    weightMedium: 500,
    weightSemibold: 600,
  },
  logging: {
    level: 'warn' as const,
    remoteLoggingEnabled: true,
  },
  featureFlags: {
    enableUsers: true,
  },
  mockApiEnabled: false,
};

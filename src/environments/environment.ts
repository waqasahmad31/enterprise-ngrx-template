export const environment = {
  production: false,
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
    level: 'debug' as const,
    remoteLoggingEnabled: false,
  },
  featureFlags: {
    enableUsers: true,
  },
  mockApiEnabled: true,
};

export const environment = {
  production: true,
  apiBaseUrl: '/api',
  logging: {
    level: 'warn' as const,
    remoteLoggingEnabled: true,
  },
  featureFlags: {
    enableUsers: true,
  },
  mockApiEnabled: false,
};

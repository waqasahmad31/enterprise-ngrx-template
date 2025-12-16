export const environment = {
  production: false,
  apiBaseUrl: '/api',
  logging: {
    level: 'debug' as const,
    remoteLoggingEnabled: false,
  },
  featureFlags: {
    enableUsers: true,
  },
  mockApiEnabled: true,
};

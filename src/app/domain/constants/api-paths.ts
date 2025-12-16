// These are *path suffixes*; the effective base URL comes from runtime config (`apiBaseUrl`).
export const API_PATHS = {
  auth: {
    csrf: '/auth/csrf',
    login: '/auth/login',
    refresh: '/auth/refresh',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  users: {
    root: '/users',
    byId: (id: string) => `/users/${encodeURIComponent(id)}`,
  },
} as const;

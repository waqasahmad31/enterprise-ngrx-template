export const APP_ROUTES = {
  auth: {
    login: '/auth/login',
  },
  dashboard: '/dashboard',
  settings: '/settings',
  profile: '/profile',
  notifications: '/notifications',
  reports: '/reports',
  audit: '/audit',
  teams: '/teams',
  roles: '/roles',
  billing: '/billing',
  integrations: '/integrations',
  support: '/support',
  users: {
    root: '/users',
    details: (id: string) => `/users/${encodeURIComponent(id)}`,
    edit: (id: string) => `/users/${encodeURIComponent(id)}/edit`,
    create: '/users/new',
  },
  error: '/error',
} as const;

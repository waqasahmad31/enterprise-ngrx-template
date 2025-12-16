import type { Permission } from '@domain/auth/auth.models';

export const PERMISSIONS = {
  usersRead: 'users.read',
  usersWrite: 'users.write',
  settingsRead: 'settings.read',
  settingsWrite: 'settings.write',
  reportsRead: 'reports.read',
  auditRead: 'audit.read',
  teamsRead: 'teams.read',
  rolesRead: 'roles.read',
  billingRead: 'billing.read',
  integrationsRead: 'integrations.read',
  supportRead: 'support.read',
} as const satisfies Record<string, Permission>;

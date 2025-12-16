import { test, expect } from '@playwright/test';

// This test assumes the mock API is enabled in dev and that
// MOCK_CREDENTIALS.user has limited permissions (no billingRead).

test('non-admin user trying to access Billing is redirected to /forbidden', async ({ page }) => {
  // Sign in as the regular user.
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('user@acme.test');
  await page.getByLabel('Password').fill('user');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  // Try to navigate directly to a route requiring elevated permissions.
  await page.goto('/billing');

  await expect(page).toHaveURL(/\/forbidden/);
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  await expect(page.getByText('You don’t have permission to view this page.')).toBeVisible();
});

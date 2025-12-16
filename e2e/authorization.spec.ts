import { test, expect } from '@playwright/test';

// This test assumes the mock API is enabled in dev and that
// MOCK_CREDENTIALS.user has limited permissions (no billingRead).

test('non-admin user trying to access Billing is redirected to /forbidden', async ({ page }) => {
  // Sign in as the regular user.
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('user@acme.test');
  await page.getByRole('textbox', { name: 'Password' }).fill('user');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  // Try to navigate to a route requiring elevated permissions.
  // Note: using `page.goto('/billing')` would trigger a full page load; with SSR enabled in dev,
  // the server render cannot read the mock localStorage session and will always redirect to login.
  // This simulates a direct URL change within the SPA so the guards still run.
  await page.evaluate(() => {
    globalThis.history.pushState({}, '', '/billing');
    globalThis.dispatchEvent(new PopStateEvent('popstate'));
  });

  await expect(page).toHaveURL(/\/forbidden/);
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();
  await expect(page.getByText('You don’t have permission to view this page.')).toBeVisible();
});

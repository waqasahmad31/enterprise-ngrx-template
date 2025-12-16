import { test, expect } from '@playwright/test';

test('redirects unauthenticated users to login', async ({ page }) => {
  await page.goto('/users');
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
});

test('can sign in and open Users list (mock API)', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('admin@acme.test');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  const usersNav = page
    .locator('.p-panelmenu')
    .locator('a,button')
    .filter({ hasText: 'Users' })
    .first();

  if (!(await usersNav.isVisible())) {
    await page.getByRole('button', { name: 'Toggle navigation' }).click();
  }

  await usersNav.click();
  await expect(page).toHaveURL(/\/users/);
  await expect(page.getByRole('heading', { name: 'Users', level: 1 })).toBeVisible();

  await expect(page.getByText('admin@acme.test')).toBeVisible();
});

test('can open notifications overlay and navigate to Notifications page', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('admin@acme.test');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Notifications' }).click();
  await expect(page.locator('[aria-label="Recent notifications"]')).toBeVisible();
  await expect(page.getByText('Mark all read')).toBeVisible();

  await page.locator('.notif-panel').locator('a').filter({ hasText: 'View all' }).click();

  await expect(page).toHaveURL(/\/notifications/);
  await expect(page.getByRole('heading', { name: 'Notifications', level: 1 })).toBeVisible();
  await expect(page.getByText('Inbox')).toBeVisible();
});

test('can use global search to navigate to Users', async ({ page }) => {
  await page.goto('/auth/login');

  await page.getByLabel('Email').fill('admin@acme.test');
  await page.getByLabel('Password').fill('admin');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);

  const searchInput = page.locator('#globalSearch');
  await expect(searchInput).toBeVisible();
  await searchInput.click();
  await searchInput.type('users', { delay: 30 });

  const listbox = page.getByRole('listbox', { name: 'Option List' });
  await expect(listbox).toBeVisible();
  await listbox.getByRole('option', { name: 'Users' }).click();

  await expect(page).toHaveURL(/\/users/);
  await expect(page.getByRole('heading', { name: 'Users', level: 1 })).toBeVisible();
});

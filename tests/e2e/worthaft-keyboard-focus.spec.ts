import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    localStorage.removeItem('worthaft-daily-game');
  });
});

for (const width of [390, 1440]) test(`newsletter typing does not control Worthaft at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/worthaft');
  const grid = page.getByTestId('worthaft-grid');
  await expect(grid).toBeVisible();
  // A visible key click confirms hydration before testing keyboard handlers.
  await page.getByRole('button', { name: 'S', exact: true }).click();
  await expect(grid).toHaveText('S');
  const email = page.getByRole('textbox', { name: 'E-Mail-Adresse eingeben' });
  await email.click();
  await email.pressSequentially('test@example.invalid');
  await expect(email).toHaveValue('test@example.invalid');
  await expect(grid).toHaveText('S');
  await email.press('Backspace');
  await expect(email).toHaveValue('test@example.invali');
  await expect(grid).toHaveText('S');
  await email.press('Enter');
  await expect(grid).toHaveText('S');
  await expect(page.getByText('Unvollständiges Wort', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/ungültiges Wort/)).toHaveCount(0);
  await page.getByRole('button', { name: 'T', exact: true }).click();
  await page.keyboard.type('ern');
  await expect(grid).toHaveText('STERN');
});

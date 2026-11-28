import { test, expect, type Page } from '@playwright/test';

const seed = (page: Page, settings?: Record<string, unknown>) => page.addInitScript((extra) => {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  localStorage.setItem('theme', 'light');
  localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
  if (extra && !localStorage.getItem('worthaft-settings')) localStorage.setItem('worthaft-settings', JSON.stringify(extra));
  if (!localStorage.getItem('worthaft-daily-game')) localStorage.setItem('worthaft-daily-game', JSON.stringify({
    date, status: 'playing',
    guesses: [{ guess: 'REGEL', statuses: ['present', 'absent', 'correct', 'correct', 'absent'] }],
    letterStatuses: { R: 'present', E: 'correct', G: 'correct', L: 'absent', Ü: 'absent' },
    rowTimes: [1000],
  }));
}, settings);

// Second grid row = current row after one submitted guess.
const cells = (page: Page) => page.getByTestId('worthaft-grid').locator('> div').nth(1).locator('> div');
const letters = async (page: Page) => (await cells(page).allTextContents()).map(text => text.trim());

test.beforeEach(async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
});

test('ArrowUp fills confirmed letters at their positions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await seed(page);
  await page.goto('/worthaft');
  await expect(page.getByTestId('worthaft-grid')).toBeVisible();
  expect(await letters(page)).toEqual(['', '', '', '', '']);
  await page.keyboard.press('ArrowUp');
  await expect.poll(() => letters(page)).toEqual(['', '', 'G', 'E', '']);
  await page.screenshot({ path: 'test-results/arrow-up-desktop.png' });
});

test('ArrowUp keeps letters the player already typed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await seed(page);
  await page.goto('/worthaft');
  await expect(page.getByTestId('worthaft-grid')).toBeVisible();
  await page.keyboard.press('X');
  await page.keyboard.press('ArrowUp');
  await expect.poll(() => letters(page)).toEqual(['X', '', 'G', 'E', '']);
  await page.screenshot({ path: 'test-results/arrow-up-merge-desktop.png' });
});

test('mobile: setting is off by default, can be enabled and prefills new rows after reload', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await seed(page);
  await page.goto('/worthaft');
  await expect(page.getByTestId('worthaft-grid')).toBeVisible();
  expect(await letters(page)).toEqual(['', '', '', '', '']);
  await page.getByRole('button', { name: /einstellungen/i }).first().click();
  await page.getByRole('tab', { name: /spiel/i }).click();
  const box = page.getByLabel('Blaue Buchstaben wiederholen');
  await expect(box).not.toBeChecked();
  await box.click();
  await expect(box).toBeChecked();
  await page.screenshot({ path: 'test-results/mobile-setting-on.png' });
  await page.reload();
  await expect.poll(() => letters(page)).toEqual(['', '', 'G', 'E', '']);
  await page.screenshot({ path: 'test-results/mobile-prefilled.png' });
});

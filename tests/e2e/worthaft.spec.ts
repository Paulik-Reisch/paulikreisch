import { test, expect } from '@playwright/test';

for (const width of [320, 375, 414, 768, 1440]) {
  test(`Worthaft feedback can be skipped and definitions load on demand at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    let requests = 0;
    await page.route('**/api/worthaft/definition', route => {
      requests += 1;
      return route.fulfill({ json: { definition: 'Ein Beispielwort mit einer kurzen deutschen Erklärung.' } });
    });
    await page.addInitScript(() => {
      const now = new Date();
      const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
      localStorage.setItem('worthaft-daily-game', JSON.stringify({ date, status: 'won', guesses: [{ guess: 'bruch', statuses: Array(5).fill('correct') }], letterStatuses: {}, rowTimes: [1000] }));
    });
    await page.goto('/worthaft');
    const skip = page.getByRole('button', { name: 'Überspringen', exact: true });
    await expect(skip).toBeVisible();
    await skip.click();
    await expect(page.getByText('Gratulation!', { exact: true })).toBeVisible();
    expect(requests).toBe(0);
    await page.getByRole('button', { name: /Was ist das/ }).click();
    await expect(page.getByText('Ein Beispielwort mit einer kurzen deutschen Erklärung.', { exact: true })).toBeVisible();
    expect(requests).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('worthaft-feedback-')).map(key => localStorage.getItem(key)))).toEqual(['skipped']);
    await page.screenshot({ path: `test-results/worthaft-definition-${width}.png`, fullPage: true });
    if (width === 375) {
      await page.reload();
      await expect(page.getByText('Gratulation!', { exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Überspringen', exact: true })).toHaveCount(0);
      expect(requests).toBe(1);
    }
  });
}

test('feedback can also be skipped after selecting a negative vote without submitting it', async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    localStorage.setItem('worthaft-daily-game', JSON.stringify({ date, status: 'lost', guesses: [{ guess: 'bruch', statuses: Array(5).fill('absent') }], letterStatuses: {}, rowTimes: [1000] }));
  });
  await page.goto('/worthaft');
  await page.getByRole('button', { name: 'Nein, das Wort war nicht gut' }).click();
  await expect(page.getByRole('button', { name: 'Feedback senden', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
  await expect(page.getByText('Leider verloren!', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /Was ist das/ })).toHaveCount(0);
  expect(await page.evaluate(() => Object.keys(localStorage).filter(key => key.startsWith('worthaft-feedback-')).map(key => localStorage.getItem(key)))).toEqual(['skipped']);
});

test('word explanation offers retry after a failed request and returns focus on close', async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  let attempts = 0;
  await page.route('**/api/worthaft/definition', route => {
    attempts += 1;
    return attempts === 1
      ? route.fulfill({ status: 503, json: { error: 'Die Worterklärung ist gerade nicht verfügbar.' } })
      : route.fulfill({ json: { definition: 'Eine Birne ist eine Frucht.' } });
  });
  await page.addInitScript(() => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    localStorage.setItem(`worthaft-feedback-${date}`, 'true');
    localStorage.setItem('worthaft-daily-game', JSON.stringify({ date, status: 'won', guesses: [{ guess: 'birne', statuses: Array(5).fill('correct') }], letterStatuses: {}, rowTimes: [1000] }));
  });
  await page.goto('/worthaft');
  const trigger = page.getByRole('button', { name: /Was ist das/ });
  await trigger.click();
  await expect(page.getByRole('alert')).toContainText('Die Erklärung ist gerade nicht verfügbar.');
  await page.getByRole('button', { name: /erneut versuchen/i }).click();
  await expect(page.getByText('Eine Birne ist eine Frucht.', { exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(page.getByText('Gratulation!', { exact: true })).toBeVisible();
  await trigger.click();
  await expect(page.getByText('Eine Birne ist eine Frucht.', { exact: true })).toBeVisible();
  expect(attempts).toBe(2);
});

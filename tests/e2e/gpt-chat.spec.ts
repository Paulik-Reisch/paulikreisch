import { test, expect } from '@playwright/test';

for (const width of [320, 375, 768, 1440]) {
  test(`the experimental writing room works at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.route('**/api/gpt/chat', route => route.fulfill({ json: { message: '**Der Elternabend** begann pünktlich.\n\n| Tagesordnung | Status |\n| --- | --- |\n| Tagesordnung | hat eine eigene Tagesordnung |' } }));
    await page.addInitScript(() => {
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
      if (!sessionStorage.getItem('gpt-e2e-initialized')) {
        localStorage.removeItem('paulik-reisch-gpt-conversations');
        sessionStorage.setItem('gpt-e2e-initialized', 'true');
      }
    });

    await page.goto('/gpt');
    await expect(page.getByRole('heading', { name: /Der Alltag schreibt vor/i })).toBeVisible();
    await page.getByRole('button', { name: /Schule & Alltag/ }).click();
    await page.getByRole('button', { name: 'Nachricht senden' }).click();
    const assistantMessage = page.locator('article').nth(1);
    await expect(assistantMessage.locator('strong')).toHaveText('Der Elternabend');
    await expect(assistantMessage.locator('table')).toBeVisible();
    await expect(assistantMessage.locator('td').nth(1)).toHaveText('hat eine eigene Tagesordnung');
    await expect(page.getByText(/OpenRouter|Experimentell/i)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    if (width <= 680) {
      await page.getByRole('button', { name: 'Chatverlauf öffnen' }).click();
      await expect(page.getByLabel('Chatverlauf').getByText(/Schreib eine kurze satirische Szene/)).toBeVisible();
      await page.getByLabel('Chatverlauf').getByRole('button', { name: 'Seitenleiste schließen' }).click();
    }

    await expect.poll(() => page.evaluate(() => localStorage.getItem('paulik-reisch-gpt-conversations') ?? '')).toContain('hat eine eigene Tagesordnung');
    await page.reload();
    const restoredAssistantMessage = page.locator('article').nth(1);
    await expect(restoredAssistantMessage.locator('strong')).toHaveText('Der Elternabend');
    await expect(restoredAssistantMessage.locator('table')).toBeVisible();
    await expect(page.getByText(/an einen externen KI-Dienst übermittelt/)).toBeVisible();
    await expect(page.getByText(/OpenRouter|Experimentell/i)).toHaveCount(0);
  });
}

test('shows a retry action when the OpenRouter request fails', async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  let attempts = 0;
  await page.route('**/api/gpt/chat', route => {
    attempts += 1;
    return attempts === 1
      ? route.fulfill({ status: 503, json: { error: 'Die Schreibstube ist gerade nicht erreichbar.' } })
      : route.fulfill({ json: { message: 'Der Behördenbrief erhielt eine eigene Empfangsbestätigung.' } });
  });
  await page.addInitScript(() => {
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    if (!sessionStorage.getItem('gpt-e2e-initialized')) {
      localStorage.removeItem('paulik-reisch-gpt-conversations');
      sessionStorage.setItem('gpt-e2e-initialized', 'true');
    }
  });

  await page.goto('/gpt');
  await page.getByLabel('Nachricht an die Schreibstube').fill('Schreibe über einen Behördenbrief.');
  await page.getByRole('button', { name: 'Nachricht senden' }).click();
  await expect(page.locator('[role="alert"]').filter({ hasText: 'gerade nicht erreichbar' })).toBeVisible();
  await page.getByRole('button', { name: 'Erneut versuchen' }).click();
  await expect(page.getByText(/eigene Empfangsbestätigung/)).toBeVisible();
  expect(attempts).toBe(2);
});
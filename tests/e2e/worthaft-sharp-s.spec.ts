import { test, expect } from '@playwright/test';

for (const width of [320, 375, 414, 768, 1440]) {
  test(`physical sharp s stays one letter in a suggested five-letter word at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('theme', 'light');
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    });
    await page.goto('/worthaft');
    await expect(page.getByTestId('worthaft-grid')).toBeVisible();
    const keyboard = await page.context().newCDPSession(page);
    for (const key of ['b', 'ü', 'ß', 'e', 'r']) {
      await keyboard.send('Input.dispatchKeyEvent', { type: 'keyDown', key });
      await keyboard.send('Input.dispatchKeyEvent', { type: 'keyUp', key });
    }
    await expect(page.getByTestId('worthaft-grid')).toContainText('ẞ');
    await page.keyboard.press('Enter');
    await expect(page.getByText('„BÜẞER“ ist ein ungültiges Wort', { exact: true })).toBeVisible();
    await expect(page.getByText('„BÜSSER“ ist ein ungültiges Wort', { exact: true })).toHaveCount(0);
    await page.screenshot({ path: `test-results/worthaft-sharp-s-${width}.png`, fullPage: true });
  });
}

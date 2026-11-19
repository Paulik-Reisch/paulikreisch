import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`absent keyboard letters match the evaluated tile gray at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.addInitScript(() => {
      const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      localStorage.setItem('theme', 'light');
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
      localStorage.setItem('worthaft-daily-game', JSON.stringify({
        date, status: 'playing',
        guesses: [{ guess: 'REGEL', statuses: ['present', 'absent', 'correct', 'correct', 'absent'] }],
        letterStatuses: { R: 'present', E: 'correct', G: 'correct', L: 'absent', Ü: 'absent' },
        rowTimes: [1000],
      }));
    });
    await page.goto('/worthaft');
    const key = page.getByTestId('worthaft-keyboard').getByRole('button', { name: 'L', exact: true });
    await expect(key).toBeVisible();
    const tile = page.getByTestId('worthaft-grid').getByText('L', { exact: true });
    const gray = await tile.evaluate(e => getComputedStyle(e).backgroundColor);
    await expect(key).toHaveCSS('background-color', gray);
    await expect(key).toHaveCSS('opacity', '1');
    const umlaut = page.getByTestId('worthaft-keyboard').getByRole('button', { name: 'Ü', exact: true });
    await expect(umlaut).toHaveCSS('background-color', gray);
    await expect(umlaut).toHaveCSS('opacity', '1');
    await page.screenshot({ path: `test-results/key-color-${width}.png`, fullPage: false, animations: 'disabled' });
    await key.hover();
    await expect(key).toHaveCSS('background-color', gray);
    await expect(key).toHaveCSS('opacity', '1');
  });
}

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 1440]) {
  test(`Game Labs cards and Wikipedia logo render at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => localStorage.setItem('hallowelt_cookie_consent', '{}'));
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.goto('/game-labs');
    for (const [title, href] of [['Wikiland', '/wikiland'], ['Bits', '/game-labs/bits'], ['Worthaft', '/worthaft']]) {
      const card = page.getByRole('article').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
      await expect(card.getByRole('link', { name: 'Jetzt spielen' })).toHaveAttribute('href', href);
    }
    await expect.poll(() => page.locator('img[src*="wikipedia-logo"]').evaluateAll(images => images.length > 0 && images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 390) {
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations).toEqual([]);
    }
    await page.screenshot({ path: `test-results/game-labs-${width}.png`, fullPage: true });
  });
}

test('Wikiland logo loads and its shimmer respects reduced motion', async ({ page }) => {
  await page.goto('/game-labs/wikiland');
  const logo = page.locator('header img[src*="wikipedia-logo"]');
  await expect(logo).toBeVisible();
  await expect.poll(() => logo.evaluate(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0)).toBe(true);
  expect(await logo.evaluate(image => getComputedStyle(image.parentElement!, '::after').animationName)).not.toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await logo.evaluate(image => getComputedStyle(image.parentElement!, '::after').animationName)).toBe('none');
});

test('retired game routes return 404 and are absent from the catalog', async ({ page, request }) => {
  for (const route of ['/game-labs/hangman', '/game-labs/worthaft-classic']) {
    const response = await request.get(route);
    expect(response.status()).toBe(404);
  }
  await page.addInitScript(() => localStorage.setItem('hallowelt_cookie_consent', '{}'));
  await page.goto('/game-labs');
  await expect(page.getByRole('article')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Hangman', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Worthaft Classic', exact: true })).toHaveCount(0);
});

import { test, expect } from '@playwright/test';

const selfLinks = [
  { path: '/worthaft', hiddenHref: '/worthaft' },
  { path: '/shop', hiddenHref: '/shop' },
];

for (const { path, hiddenHref } of selfLinks) {
  for (const width of [375, 1440]) {
    test(`header omits the current-page link on ${path} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
      await page.addInitScript(() => {
        localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
      });

      await page.goto(path);
      if (width < 768) {
        await page.getByRole('button', { name: 'Menü öffnen' }).click();
      }

      const navigation = width < 768
        ? page.getByRole('dialog', { name: 'Navigation' }).getByRole('navigation', { name: 'Hauptnavigation' })
        : page.locator('header nav');
      await expect(navigation.locator(`a[href="${hiddenHref}"]`)).toHaveCount(0);
      await expect(navigation.locator('a[href="/gpt"]')).toHaveCount(0);

      if (width < 768) {
        const dialog = page.getByRole('dialog', { name: 'Navigation' });
        const dialogBox = await dialog.boundingBox();
        const links = navigation.locator('a');
        const linkCount = await links.count();
        expect(linkCount).toBe(1);
        expect(dialogBox).not.toBeNull();
        expect(dialogBox!.height).toBeLessThan(340);
        expect(dialogBox!.width).toBeCloseTo(width * 0.82, 0);

        const buttonContainer = navigation.locator(':scope > div');
        const containerBox = await buttonContainer.boundingBox();
        expect(containerBox).not.toBeNull();
        for (const link of await links.all()) {
          await expect(link).toHaveCSS('justify-content', 'center');
          const linkBox = await link.boundingBox();
          expect(linkBox).not.toBeNull();
          expect(linkBox!.width).toBeCloseTo(containerBox!.width, 0);
        }
      }
    });
  }
}

for (const width of [375, 1440]) {
  test(`Schreibstube keeps its custom layout without a self-link at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    });

    await page.goto('/gpt');
    await expect(page.getByRole('heading', { name: /Der Alltag schreibt vor/i })).toBeVisible();
    await expect(page.locator('header nav')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Schreibstube', exact: true })).toHaveCount(0);
  });
}

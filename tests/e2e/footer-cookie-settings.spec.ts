import { test, expect } from '@playwright/test';

for (const width of [320, 375, 414, 768, 1440]) {
  for (const path of ['/', '/worthaft', '/datenschutz']) {
    test(`cookie settings stay inside footer More menu at ${width}px on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() => {
        localStorage.setItem('theme', 'light');
        localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false, version: 2 }));
      });
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const settings = page.getByRole('button', { name: 'Cookie-Einstellungen', exact: true });
      await expect(settings).not.toBeVisible();
      const more = page.getByRole('button', { name: 'Mehr', exact: true });
      await more.scrollIntoViewIfNeeded();
      await more.click();
      const menu = page.getByRole('region', { name: 'Weitere rechtliche Informationen' });
      await expect(menu.getByRole('link', { name: 'Cookie-Richtlinie', exact: true })).toBeVisible();
      await expect(menu.getByRole('button', { name: 'Cookie-Einstellungen', exact: true })).toBeVisible();
      await settings.click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(menu).not.toBeVisible();
      await expect(page.getByRole('switch', { name: 'Analyse & Leistung', exact: true })).not.toBeChecked();
      await page.getByRole('button', { name: 'Auswahl speichern', exact: true }).click();
      await expect(page.getByRole('dialog')).not.toBeVisible();
      await expect(more).toBeFocused();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
}

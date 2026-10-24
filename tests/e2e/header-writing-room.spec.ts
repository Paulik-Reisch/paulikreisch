import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`header links to the writing room next to Worthaft at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    });

    await page.goto('/');
    if (width < 768) {
      await page.getByRole('button', { name: 'Menü öffnen' }).click();
    }

    const writingRoomLink = page.getByRole('link', { name: 'Schreibstube (KI)' });
    await expect(writingRoomLink).toBeVisible();

    if (width >= 768) {
      const worthaftLink = page.getByRole('banner').getByRole('link', { name: 'Worthaft' });
      const writingRoomBox = await writingRoomLink.boundingBox();
      const worthaftBox = await worthaftLink.boundingBox();
      expect(writingRoomBox).not.toBeNull();
      expect(worthaftBox).not.toBeNull();
      expect(writingRoomBox!.x).toBeLessThan(worthaftBox!.x);
    }

    await writingRoomLink.click();
    await expect(page).toHaveURL(/\/gpt$/);
    await expect(page.getByRole('heading', { name: /Der Alltag schreibt vor/i })).toBeVisible();
  });
}

import { test, expect } from '@playwright/test';

for (const width of [375, 1440]) {
  test(`header navigation keeps its intended order at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    });

    await page.goto('/');
    if (width < 768) {
      await page.getByRole('button', { name: 'Menü öffnen' }).click();
    }

    const writingRoomLink = page.getByRole('link', { name: 'Schreibstube', exact: true });
    await expect(writingRoomLink).toBeVisible();

    if (width >= 768) {
      const desktopNav = page.locator('header nav');
      const worthaftLink = desktopNav.locator('a[href="/worthaft"]');
      const shopLink = desktopNav.locator('a[href="/shop"]');
      const writingRoomNavLink = desktopNav.locator('a[href="/gpt"]');
      const writingRoomBox = await writingRoomLink.boundingBox();
      const worthaftBox = await worthaftLink.boundingBox();
      const shopBox = await shopLink.boundingBox();
      const writingRoomNavBox = await writingRoomNavLink.boundingBox();
      expect(writingRoomBox).not.toBeNull();
      expect(worthaftBox).not.toBeNull();
      expect(shopBox).not.toBeNull();
      expect(writingRoomNavBox).not.toBeNull();
      expect(worthaftBox!.x).toBeLessThan(shopBox!.x);
      expect(shopBox!.x).toBeLessThan(writingRoomNavBox!.x);
    }

    await writingRoomLink.click();
    await expect(page).toHaveURL(/\/gpt$/);
    await expect(page.getByRole('heading', { name: /Der Alltag schreibt vor/i })).toBeVisible();
  });
}

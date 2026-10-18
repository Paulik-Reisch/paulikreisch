import { test, expect } from '@playwright/test';

for (const width of [320, 375, 414, 768, 1440]) {
  test(`appearance preview, persistence and maximum dimensions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
    await page.addInitScript(() => {
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    });
    await page.goto('/worthaft');
    await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
    const settings = page.getByRole('dialog');
    await expect(page.getByTestId('appearance-preview')).toBeVisible();
    const correctPreview = page.getByTestId('appearance-preview').getByText('W', { exact: true });
    await expect(correctPreview).toHaveCSS('background-color', 'rgb(0, 103, 217)');
    expect(await settings.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.screenshot({ path: `test-results/worthaft-settings-top-${width}.png`, fullPage: true });
    await settings.getByRole('button', { name: /Klassisch/ }).click();
    await expect(settings.getByRole('button', { name: /Klassisch/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(correctPreview).toHaveCSS('background-color', 'rgb(71, 122, 67)');
    for (const name of ['Tastenbreite', 'Tastenhöhe', 'Tastenrundung', 'Kachelbreite', 'Kachelhöhe', 'Kachelrundung']) {
      const slider = settings.getByRole('slider', { name, exact: true });
      await slider.focus();
      await slider.press('End');
      await expect(slider).toHaveValue('4');
    }
    // Letters and arrows in the drawer must never edit the puzzle.
    await settings.getByRole('slider', { name: 'Kachelrundung', exact: true }).press('a');
    expect(await settings.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/worthaft-settings-${width}.png`, fullPage: true });
    await page.keyboard.press('Escape');
    await expect(settings).not.toBeVisible();
    await expect(page.getByTestId('worthaft-grid')).not.toContainText('A');
    const grid = await page.getByTestId('worthaft-grid').boundingBox();
    const keyboard = await page.getByTestId('worthaft-keyboard').boundingBox();
    expect(grid!.x).toBeGreaterThanOrEqual(0);
    expect(grid!.x + grid!.width).toBeLessThanOrEqual(width);
    expect(keyboard!.x + keyboard!.width).toBeLessThanOrEqual(width);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload();
    await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
    await expect(settings.getByRole('button', { name: /Klassisch/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(correctPreview).toHaveCSS('background-color', 'rgb(71, 122, 67)');
    await expect(settings.getByRole('slider', { name: 'Kachelrundung', exact: true })).toHaveValue('4');
    await settings.getByRole('button', { name: 'Aussehen zurücksetzen' }).click();
    await expect(settings.getByRole('button', { name: /^Worthaft/ })).toHaveAttribute('aria-pressed', 'true');
    await expect(settings.getByRole('slider', { name: 'Kachelrundung', exact: true })).toHaveValue('0');
    await expect(settings.getByRole('slider', { name: 'Tastenbreite', exact: true })).toHaveValue('2');
  });
}

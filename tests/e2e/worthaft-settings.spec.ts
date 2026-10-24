import { test, expect } from '@playwright/test';

test('game appearance preferences persist and can be reset', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    if (!sessionStorage.getItem('worthaft-settings-initialized')) {
      localStorage.removeItem('worthaft-settings');
      sessionStorage.setItem('worthaft-settings-initialized', 'true');
    }
  });
  await page.goto('/worthaft');
  await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();

  const settings = page.getByRole('dialog');
  const paletteGroup = settings.getByRole('group', { name: 'Farbschema' });
  const classicPalette = paletteGroup.getByRole('button', { name: /Klassisch/ });
  await classicPalette.click();
  await expect(classicPalette).toHaveAttribute('aria-pressed', 'true');

  const radius = settings.getByRole('slider', { name: 'Kachelrundung', exact: true });
  await radius.focus();
  await radius.press('End');
  await expect(radius).toHaveValue('4');

  await page.reload();
  await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
  const restoredSettings = page.getByRole('dialog');
  const restoredClassicPalette = restoredSettings.getByRole('group', { name: 'Farbschema' }).getByRole('button', { name: /Klassisch/ });
  await expect(restoredClassicPalette).toHaveAttribute('aria-pressed', 'true');
  await expect(restoredSettings.getByRole('slider', { name: 'Kachelrundung', exact: true })).toHaveValue('4');

  await restoredSettings.getByRole('button', { name: 'Aussehen zurücksetzen' }).click();
  await expect(restoredSettings.getByRole('group', { name: 'Farbschema' }).getByRole('button', { name: /^Worthaft/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(restoredSettings.getByRole('slider', { name: 'Kachelrundung', exact: true })).toHaveValue('0');
});

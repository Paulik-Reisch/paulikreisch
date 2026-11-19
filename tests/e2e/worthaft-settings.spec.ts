import { test, expect } from '@playwright/test';

for (const width of [320, 375, 414, 768, 1440]) {
  test(`settings categories keep their controls reachable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.addInitScript(() => {
      localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    });
    await page.goto('/worthaft');
    await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
    const dialog = page.getByRole('dialog', { name: 'Einstellungen' });
    const categories = dialog.getByRole('tablist', { name: 'Einstellungskategorien' });
    await expect(categories).toHaveAttribute('aria-orientation', width < 768 ? 'horizontal' : 'vertical');
    await expect(dialog.getByRole('slider', { name: 'Tastenbreite' })).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds!.width).toBeLessThanOrEqual(width);
    if (width >= 768) expect(bounds!.width).toBeGreaterThan(600);
    await dialog.screenshot({ path: `test-results/worthaft-settings-${width}.png`, animations: 'disabled' });
    await categories.getByRole('tab', { name: 'Spiel' }).click();
    await expect(dialog.getByRole('checkbox', { name: 'Heißer Tipp aktiv' })).toBeChecked();
    await expect(dialog.getByRole('checkbox', { name: 'Animationen & Effekte' })).toBeVisible();
    await categories.getByRole('tab', { name: 'Ton' }).click();
    await expect(dialog.getByRole('checkbox', { name: 'Hintergrundmusik' })).toBeVisible();
  });
}

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
  const expectedDefaults = [
    ['Tastenbreite', '4'],
    ['Tastenhöhe', '2'],
    ['Schriftgröße', '2'],
    ['Tastenrundung', '1'],
    ['Kachelbreite', '1'],
    ['Kachelhöhe', '1'],
    ['Kachelrundung', '1'],
  ] as const;
  for (const [name, value] of expectedDefaults) {
    const slider = settings.getByRole('slider', { name, exact: true });
    await expect(slider).toHaveValue(value);
    await expect(slider).toHaveAttribute('aria-valuetext', `Stufe ${value}`);
  }
  await expect(settings.getByRole('region', { name: 'Aussehen' })).not.toContainText('px');

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
  for (const [name, value] of expectedDefaults) {
    await expect(restoredSettings.getByRole('slider', { name, exact: true })).toHaveValue(value);
  }
  await expect(restoredSettings.getByRole('region', { name: 'Aussehen' })).not.toContainText('px');
});

test('keyboard expands symmetrically with key width and stays within the viewport', async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
    localStorage.removeItem('worthaft-settings');
  });
  await page.setViewportSize({ width: 1280, height: 812 });
  await page.goto('/worthaft');

  await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
  const keyWidth = page.getByRole('dialog').getByRole('slider', { name: 'Tastenbreite', exact: true });
  await keyWidth.focus();
  await keyWidth.press('Home');
  await expect(keyWidth).toHaveValue('0');
  await page.keyboard.press('Escape');

  const initialKeyboardWidth = (await page.getByTestId('worthaft-keyboard').boundingBox())?.width;
  if (initialKeyboardWidth === undefined) {
    throw new Error('Worthaft keyboard is not visible');
  }

  await page.getByRole('button', { name: 'Einstellungen öffnen' }).click();
  await keyWidth.focus();
  await keyWidth.press('End');
  await expect(keyWidth).toHaveValue('4');
  await page.keyboard.press('Escape');

  let expandedKeyboardWidth = 0;
  for (const width of [320, 375, 1280]) {
    await page.setViewportSize({ width, height: 812 });

    const gridBox = await page.getByTestId('worthaft-grid').boundingBox();
    const keyboardBox = await page.getByTestId('worthaft-keyboard').boundingBox();
    if (!gridBox || !keyboardBox) {
      throw new Error('Worthaft board or keyboard is not visible');
    }

    expect(keyboardBox.x + keyboardBox.width / 2).toBeCloseTo(gridBox.x + gridBox.width / 2, 1);
    expect(keyboardBox.x).toBeGreaterThanOrEqual(0);
    expect(keyboardBox.x + keyboardBox.width).toBeLessThanOrEqual(width);
    if (width < 640) {
      expect(keyboardBox.width).toBeGreaterThanOrEqual(gridBox.width);
    } else {
      expect(keyboardBox.width).toBeGreaterThan(gridBox.width);
      expandedKeyboardWidth = keyboardBox.width;
    }
  }
  expect(expandedKeyboardWidth).toBeGreaterThan(initialKeyboardWidth);
});

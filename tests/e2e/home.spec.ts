import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false })));
});

for (const width of [320, 375, 414, 768, 1440]) {
  test(`homepage content and primary destinations work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('#buch figure figcaption')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Seiten lesen/ })).toHaveAttribute('href', '/leseprobe');
    await expect(page.locator('section[aria-labelledby="preview-title"] img[alt="Eine lesende Maus mit Brille sitzt in einem Sessel und liest ein Buch"]')).toHaveAttribute('src', /lesende-maus\.jpg/);
    await expect(page.locator('#entdecken img')).toHaveAttribute('src', /32-tafel-kreide/);
    await expect(page.locator('section[aria-labelledby="preview-title"] p').nth(1)).toHaveCSS('font-weight', '400');
    await expect(page.getByRole('link', { name: '„Hallo Welt“ entdecken' })).toHaveAttribute('href', '/shop');
    await expect(page.getByRole('link', { name: 'Worthaft spielen' })).toHaveAttribute('href', '/worthaft');
    await expect(page.locator('a[href="/a"], a[href^="/a/"], a[href="/artikel"], a[href^="/artikel/"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByText('Was ist „Hallo Welt“?', { exact: true }).click();
    await expect(page.locator('details[open]')).toBeVisible();
  });
}

test('reading sample stays simple and the selected-page slideshow supports controls and swiping', async ({ page }) => {
  await page.goto('/leseprobe');

  await expect(page.getByRole('heading', { level: 1, name: 'Ein Blick ins Buch.' })).toBeVisible();
  await expect(page.getByText(/Hier kannst du durch ausgewählte Seiten/)).toBeVisible();
  const pdfSlide = page.locator('figure[data-slide-type="pdf"]').nth(0);
  await expect(pdfSlide).toBeVisible();
  const pdfImage = pdfSlide.locator('img');
  await expect(pdfImage).toHaveAttribute('src', '/leseprobe/seite-58.png');
  await expect(pdfSlide.locator('figcaption')).toHaveCount(0);
  await expect(pdfSlide.locator('iframe')).toHaveCount(0);
  await expect(pdfSlide.getByRole('link')).toHaveCount(0);
  await expect.poll(() => pdfImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(1800);
  await expect(page.locator('img[alt^="Platzhalterfoto:"]')).toHaveCount(0);
  const pdfResponse = await page.request.get('/leseprobe/seite-58.pdf');
  expect(pdfResponse.ok()).toBe(true);
  expect(pdfResponse.headers()['content-type']).toContain('application/pdf');
  const previewResponse = await page.request.get('/leseprobe/seite-58.png');
  expect(previewResponse.ok()).toBe(true);
  expect(previewResponse.headers()['content-type']).toContain('image/png');
  const description = page.locator('main > section > div').first().locator('p').nth(1);
  const heading = page.getByRole('heading', { level: 1, name: 'Ein Blick ins Buch.' });
  const copy = page.locator('main > section > div').first();
  await expect(copy).toHaveCSS('align-self', 'start');
  await expect(heading).toHaveCSS('font-weight', '700');
  await expect(heading).toHaveCSS('font-family', /lora/i);
  await expect(description).toHaveCSS('font-weight', '400');
  await expect(description).toHaveCSS('font-family', /sourceSerif/i);
  const bookLink = page.getByRole('link', { name: 'Zum Buch' });
  await expect(bookLink).toHaveAttribute('href', '/shop');
  await expect(bookLink.locator('svg')).toHaveAttribute('class', /lucide-arrow-up-right/);
  const slideshow = page.getByRole('region', { name: 'Ausgewählte Seiten aus dem Buch' });
  const status = slideshow.getByText('Seite 1 von 4');
  await expect(status).toBeVisible();
  await expect(slideshow.locator('figure')).toHaveCount(4);
  await expect(slideshow.getByRole('button', { name: 'Seite 5 anzeigen' })).toHaveCount(0);
  expect(await slideshow.locator('figure').first().evaluate((figure) => getComputedStyle(figure).aspectRatio)).toBe('2 / 3');

  const frame = await slideshow.locator('figure').first().boundingBox();
  if (!frame) throw new Error('The slideshow frame is not visible.');
  await page.mouse.move(frame.x + frame.width * 0.8, frame.y + frame.height / 2);
  await page.mouse.down();
  await page.mouse.move(frame.x + frame.width * 0.2, frame.y + frame.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect(slideshow.getByText('Seite 2 von 4')).toBeVisible();

  const secondPdfSlide = slideshow.locator('figure').nth(1);
  await expect(secondPdfSlide).toHaveAttribute('data-slide-type', 'pdf');
  await expect(secondPdfSlide.locator('img')).toHaveAttribute('src', '/leseprobe/seite-72.png');
  await expect.poll(() => secondPdfSlide.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(1800);
  const secondPdfResponse = await page.request.get('/leseprobe/seite-72.pdf');
  expect(secondPdfResponse.ok()).toBe(true);
  expect(secondPdfResponse.headers()['content-type']).toContain('application/pdf');

  const thirdPdfSlide = slideshow.locator('figure').nth(2);
  await expect(thirdPdfSlide).toHaveAttribute('data-slide-type', 'pdf');
  await expect(thirdPdfSlide.locator('img')).toHaveAttribute('src', '/leseprobe/seite-91.png');
  const thirdPdfResponse = await page.request.get('/leseprobe/seite-91.pdf');
  expect(thirdPdfResponse.ok()).toBe(true);
  expect(thirdPdfResponse.headers()['content-type']).toContain('application/pdf');
  const thirdPreviewResponse = await page.request.get('/leseprobe/seite-91.png');
  expect(thirdPreviewResponse.ok()).toBe(true);
  expect(thirdPreviewResponse.headers()['content-type']).toContain('image/png');

  const fourthPdfSlide = slideshow.locator('figure').nth(3);
  await expect(fourthPdfSlide).toHaveAttribute('data-slide-type', 'pdf');
  await expect(fourthPdfSlide.locator('img')).toHaveAttribute('src', '/leseprobe/seite-96.png');
  const fourthPdfResponse = await page.request.get('/leseprobe/seite-96.pdf');
  expect(fourthPdfResponse.ok()).toBe(true);
  expect(fourthPdfResponse.headers()['content-type']).toContain('application/pdf');
  const fourthPreviewResponse = await page.request.get('/leseprobe/seite-96.png');
  expect(fourthPreviewResponse.ok()).toBe(true);
  expect(fourthPreviewResponse.headers()['content-type']).toContain('image/png');

  await slideshow.getByRole('button', { name: 'Nächste Seite' }).click();
  await expect(slideshow.getByText('Seite 3 von 4')).toBeVisible();
  await expect.poll(() => thirdPdfSlide.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(1800);
  await slideshow.getByRole('button', { name: 'Nächste Seite' }).click();
  await expect(slideshow.getByText('Seite 4 von 4')).toBeVisible();
  await expect.poll(() => fourthPdfSlide.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(1800);
  await slideshow.getByRole('button', { name: 'Vorherige Seite' }).click();
  await expect(slideshow.getByText('Seite 3 von 4')).toBeVisible();

  await slideshow.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(slideshow.getByText('Seite 2 von 4')).toBeVisible();

  await slideshow.getByRole('button', { name: 'Aktuelle Seite vergrößern' }).click();
  const zoomDialog = page.getByRole('dialog', { name: 'Vergrößerte Buchseite' });
  await expect(zoomDialog).toBeVisible();
  await expect(zoomDialog.locator('img')).toHaveAttribute('src', '/leseprobe/seite-72.png');
  await expect.poll(() => zoomDialog.locator('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThanOrEqual(1800);
  const closeButton = zoomDialog.getByRole('button', { name: 'Close' });
  await expect(zoomDialog.getByRole('button', { name: 'Vergrößern' })).toBeFocused();
  const closeButtonColors = await closeButton.evaluate((button) => {
    const styles = getComputedStyle(button);
    return {
      background: styles.backgroundColor,
      boxShadow: styles.boxShadow,
      focusVisible: button.matches(':focus-visible'),
    };
  });
  expect(closeButtonColors.background).not.toBe('rgba(0, 0, 0, 0)');
  expect(closeButtonColors.boxShadow).toBe('none');
  expect(closeButtonColors.focusVisible).toBe(false);
  const zoomFrame = zoomDialog.locator('[data-zoom-scale]');
  await expect(zoomFrame).toHaveAttribute('data-zoom-scale', '1.00');
  await zoomDialog.getByRole('button', { name: 'Vergrößern' }).click();
  await expect(zoomFrame).toHaveAttribute('data-zoom-scale', '1.50');
  const zoomImage = zoomFrame.locator('img');
  const zoomFrameBounds = await zoomFrame.boundingBox();
  if (!zoomFrameBounds) throw new Error('The zoom image frame is not visible.');
  await page.mouse.move(zoomFrameBounds.x + zoomFrameBounds.width / 2, zoomFrameBounds.y + zoomFrameBounds.height / 2);
  await page.mouse.down();
  await page.mouse.move(zoomFrameBounds.x + zoomFrameBounds.width / 2 + 80, zoomFrameBounds.y + zoomFrameBounds.height / 2 + 40, { steps: 4 });
  await page.mouse.up();
  await expect(zoomImage).toHaveAttribute('style', /translate\(80px, 40px\)/);
  await expect(slideshow.getByText('Seite 2 von 4')).toBeVisible();
  await zoomFrame.hover();
  await page.mouse.wheel(0, -100);
  await expect.poll(() => zoomFrame.getAttribute('data-zoom-scale')).toMatch(/1\.(7|8)/);
  // The dedicated reset button was removed: closing the dialog resets zoom and pan.
  await page.keyboard.press('Escape');
  await expect(zoomDialog).toBeHidden();
  await slideshow.getByRole('button', { name: 'Aktuelle Seite vergrößern' }).click();
  await expect(zoomDialog).toBeVisible();
  await expect(zoomFrame).toHaveAttribute('data-zoom-scale', '1.00');
  await expect(zoomImage).toHaveAttribute('style', /translate\(0px, 0px\)/);

  // Page navigation inside the zoom dialog: buttons and arrow keys, always with a clean zoom.
  await zoomDialog.getByRole('button', { name: 'Vergrößern' }).click();
  await expect(zoomFrame).toHaveAttribute('data-zoom-scale', '1.50');
  await zoomDialog.getByRole('button', { name: 'Nächste Seite' }).click();
  await expect(slideshow.getByText('Seite 3 von 4')).toBeVisible();
  await expect(zoomDialog.locator('img')).toHaveAttribute('src', '/leseprobe/seite-91.png');
  await expect(zoomFrame).toHaveAttribute('data-zoom-scale', '1.00');
  await page.keyboard.press('ArrowLeft');
  await expect(slideshow.getByText('Seite 2 von 4')).toBeVisible();
  await expect(zoomDialog.locator('img')).toHaveAttribute('src', '/leseprobe/seite-72.png');
  // The controls bar sits below the page image instead of covering it.
  const controlsBar = zoomDialog.getByRole('group', { name: 'Seitennavigation und Bildzoom' });
  await expect(controlsBar).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const barBounds = await controlsBar.boundingBox();
  const frameBoundsForBar = await zoomFrame.boundingBox();
  if (!barBounds || !frameBoundsForBar) throw new Error('The zoom dialog layout is not visible.');
  expect(barBounds.y).toBeGreaterThanOrEqual(frameBoundsForBar.y + frameBoundsForBar.height);

  await page.keyboard.press('Escape');
  await expect(zoomDialog).toBeHidden();

  await slideshow.getByRole('button', { name: 'Aktuelle Seite vergrößern' }).click();
  await expect(zoomDialog).toBeVisible();
  const zoomBounds = await zoomDialog.boundingBox();
  if (!zoomBounds) throw new Error('The zoom dialog is not visible.');
  await page.mouse.click(zoomBounds.x - 8, zoomBounds.y + zoomBounds.height / 2);
  await expect(zoomDialog).toBeHidden();

  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const mobilePrevious = slideshow.getByRole('button', { name: 'Vorherige Seite' });
  const mobileFrame = await slideshow.locator('figure').first().evaluate((figure) => {
    const { x, y, width, height } = figure.parentElement!.parentElement!.getBoundingClientRect();
    return { x, y, width, height };
  });
  const mobilePreviousBounds = await mobilePrevious.boundingBox();
  if (!mobileFrame || !mobilePreviousBounds) throw new Error('The mobile slideshow controls are not visible.');
  expect(mobilePreviousBounds.width).toBe(32);
  expect(mobilePreviousBounds.x - mobileFrame.x).toBe(6);
  await expect(mobilePrevious.locator('svg')).toHaveCSS('width', '16px');
});

test('former satire magazine routes are no longer available', async ({ page }) => {
  for (const path of ['/a', '/a/bis-dass-der-bagger-uns-scheidet', '/artikel', '/artikel/bis-dass-der-bagger-uns-scheidet']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
  }
});

test('404 page uses clear and neutral copy with landing page button styling', async ({ page }) => {
  const response = await page.goto('/not-found-design-check');
  expect(response?.status()).toBe(404);

  await expect(page.getByText('Seite nicht gefunden', { exact: true })).toBeVisible();
  await expect(page.getByText('ERROR', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hoppla. Diese Seite existiert nicht.' })).toBeVisible();
  await expect(page.getByText('Die Adresse ist möglicherweise falsch oder die Seite wurde verschoben. Über die Startseite findest du schnell zurück.')).toBeVisible();
  await expect(page.getByText('Nicht verfügbar', { exact: true })).toBeVisible();
  await expect(page.getByText('Hier endet die Spur')).toHaveCount(0);

  const homeLink = page.getByRole('link', { name: 'Zur Startseite' });
  await expect(homeLink).toHaveAttribute('href', '/');
  expect(await homeLink.evaluate(element => getComputedStyle(element).borderRadius)).toBe('10px');
  expect(await homeLink.evaluate(element => getComputedStyle(element).gap)).toBe('8px');
  await expect(page.getByRole('button', { name: 'Zurück' })).toBeVisible();
});

test('mobile navigation opens and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menü öffnen' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
});

test('mobile navigation keeps the same three actions and order as desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await expect(page.locator('header nav a').nth(0)).toHaveAttribute('href', '/worthaft');
  await expect(page.locator('header nav a').nth(1)).toHaveAttribute('href', '/shop');
  await expect(page.locator('header nav a').nth(2)).toHaveAttribute('href', '/gpt');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Menü öffnen' }).click();
  const mobileDialog = page.getByRole('dialog', { name: 'Navigation' });
  const mobileNav = mobileDialog.getByRole('navigation', { name: 'Hauptnavigation' }).locator('a');
  await expect(mobileNav).toHaveCount(3);
  await expect(mobileNav.nth(0)).toHaveAttribute('href', '/worthaft');
  await expect(mobileNav.nth(1)).toHaveAttribute('href', '/shop');
  await expect(mobileNav.nth(2)).toHaveAttribute('href', '/gpt');
  await expect(mobileNav.nth(0).locator('.worthaft-icon-shimmer')).toBeVisible();
  await expect(mobileDialog).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  const actionWidths = await mobileNav.evaluateAll((links) => links.map((link) => link.getBoundingClientRect().width));
  expect(new Set(actionWidths).size).toBe(1);
  const drawerBounds = await mobileDialog.boundingBox();
  if (!drawerBounds) throw new Error('The mobile navigation drawer is not visible.');
  expect(drawerBounds.width).toBeLessThan(330);
  expect(drawerBounds.x).toBeGreaterThan(0);
  expect(drawerBounds.y).toBe(12);
  // The theme row is part of the drawer, below the three navigation actions.
  // Check its structure and containment instead of the old pre-theme pixel height.
  const themeSwitch = mobileDialog.getByRole('switch', { name: 'Dunkelmodus' });
  await expect(mobileDialog.getByText('Dunkelmodus', { exact: true })).toBeVisible();
  await expect(themeSwitch).toBeVisible();
  const navigationBounds = await mobileDialog.getByRole('navigation', { name: 'Hauptnavigation' }).boundingBox();
  const themeBounds = await themeSwitch.boundingBox();
  if (!navigationBounds || !themeBounds) throw new Error('Navigation or theme control is not visible.');
  expect(themeBounds.y).toBeGreaterThanOrEqual(navigationBounds.y + navigationBounds.height);
  expect(themeBounds.y + themeBounds.height).toBeLessThanOrEqual(drawerBounds.y + drawerBounds.height);
  expect(themeBounds.x).toBeGreaterThanOrEqual(drawerBounds.x);
  expect(themeBounds.x + themeBounds.width).toBeLessThanOrEqual(drawerBounds.x + drawerBounds.width);
  expect(drawerBounds.y + drawerBounds.height).toBeLessThanOrEqual(812 - 12);
  const wasChecked = await themeSwitch.getAttribute('aria-checked');
  await themeSwitch.click();
  await expect(themeSwitch).toHaveAttribute('aria-checked', wasChecked === 'true' ? 'false' : 'true');
  // Restore the initial theme before the remaining layout assertions.
  await themeSwitch.click();
  await expect(themeSwitch).toHaveAttribute('aria-checked', wasChecked!);
  await expect(mobileDialog).toHaveCSS('border-radius', '24px');
  const drawerCenter = drawerBounds.x + drawerBounds.width / 2;
  for (const action of await mobileNav.all()) {
    const actionBounds = await action.boundingBox();
    if (!actionBounds) throw new Error('A mobile navigation action is not visible.');
    expect(Math.abs(actionBounds.x + actionBounds.width / 2 - drawerCenter)).toBeLessThan(1);
  }
  await expect(mobileDialog.getByText('5,0★ bei Amazon · 106 Seiten')).toHaveCount(0);
  await expect(mobileDialog.getByRole('link', { name: 'Impressum' })).toHaveCount(0);
  await expect(mobileDialog.getByRole('link', { name: 'Datenschutz' })).toHaveCount(0);

  await page.setViewportSize({ width: 375, height: 320 });
  const shortViewportBounds = await mobileDialog.boundingBox();
  if (!shortViewportBounds) throw new Error('The mobile navigation drawer is not visible on a short viewport.');
  expect(shortViewportBounds.height).toBeLessThanOrEqual(296);
});

test('footer exposes the guide, newsletter and legal links', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer').last();
  await expect(footer.getByRole('link', { name: 'Ratgeber', exact: true })).toHaveAttribute('href', '/ratgeber');
  await expect(footer.getByPlaceholder('E-Mail-Adresse eingeben')).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Datenschutzerklärung' })).toHaveAttribute('href', '/datenschutz');
});

for (const width of [375, 1280]) {
  test(`footer “Mehr” menu animates from its trigger and closes after five seconds at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.clock.install();

    const moreButton = page.getByRole('button', { name: 'Mehr' });
    await expect(moreButton).toBeVisible();
    await expect(moreButton).toHaveText('Mehr');
    await expect(moreButton.locator('svg')).toHaveCount(0);
    await expect(moreButton).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(moreButton).toHaveCSS('border-width', '0px');
    await expect(moreButton).toHaveCSS('box-shadow', 'none');
    await moreButton.hover();
    await expect(moreButton).toHaveCSS('text-decoration-line', 'underline');
    await moreButton.click();

    const legalMenu = width < 640
      ? page.locator('#footer-more-menu')
      : page.getByRole('region', { name: 'Weitere rechtliche Informationen' });
    await expect(legalMenu).toBeVisible();
    const firstLegalLink = legalMenu.getByRole('link', { name: 'Impressum' });
    await expect(firstLegalLink).toHaveCSS('font-size', '12px');
    await expect(legalMenu).toHaveCSS('width', '192px');
    await expect(legalMenu.getByRole('link', { name: 'Datenschutz' })).toHaveAttribute('href', '/datenschutz');
    if (width >= 640) {
      await expect(page.locator('nav[aria-label="Rechtliche Informationen"] > a[href="/impressum"]')).toHaveCount(0);
      await expect(page.locator('nav[aria-label="Rechtliche Informationen"] > a[href="/datenschutz"]')).toHaveCount(0);
    }
    if (width < 640) {
      await expect.poll(async () => {
        const triggerBounds = await moreButton.boundingBox();
        const menuBounds = await legalMenu.boundingBox();
        return triggerBounds && menuBounds
          ? Math.abs(menuBounds.x + menuBounds.width / 2 - (triggerBounds.x + triggerBounds.width / 2))
          : Number.POSITIVE_INFINITY;
      }).toBeLessThan(1);
    }
    await expect(moreButton).toHaveAttribute('aria-expanded', 'true');
    await expect(firstLegalLink).toBeVisible();

    await page.clock.fastForward(5000);
    await expect(legalMenu).toBeHidden();
    await expect(moreButton).toHaveAttribute('aria-expanded', 'false');
  });
}

for (const width of [375, 1280]) {
  test(`footer “Mehr” menu opens with the keyboard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');

    const moreButton = page.getByRole('button', { name: 'Mehr' });
    await moreButton.focus();
    await page.keyboard.press('Enter');

    const legalMenu = width < 640
      ? page.locator('#footer-more-menu')
      : page.getByRole('region', { name: 'Weitere rechtliche Informationen' });
    await expect(legalMenu).toBeVisible();
    await expect(moreButton).toHaveAttribute('aria-expanded', 'true');
  });
}

test('desktop footer “Mehr” menu stays open while hovered and closes five seconds after leaving', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await page.clock.install();

  const moreButton = page.getByRole('button', { name: 'Mehr' });
  await moreButton.click();
  const legalMenu = page.getByRole('region', { name: 'Weitere rechtliche Informationen' });
  await expect(legalMenu).toBeVisible();
  await legalMenu.hover();

  await page.clock.fastForward(5000);
  await expect(legalMenu).toBeVisible();

  await page.mouse.move(0, 0);
  await page.clock.fastForward(4999);
  await expect(legalMenu).toBeVisible();
  await page.clock.fastForward(1);
  await expect(legalMenu).toBeHidden();
});

test('mobile footer “Mehr” menu disables its animation for reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Mehr' }).click();

  const legalMenu = page.locator('#footer-more-menu');
  await expect(legalMenu).toBeVisible();
  await expect.poll(() => legalMenu.evaluate(element => getComputedStyle(element).transitionDuration)).toBe('0s');
});

test('shop and game labs expose their content and play destinations', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/shop');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Hallo Welt', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: /Bei Amazon kaufen/ })).toHaveAttribute('href', 'https://amzn.eu/d/02nS59t2');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  await page.goto('/game-labs');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Was spielen wir heute?' })).toBeVisible();
  await expect(page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Worthaft', exact: true }) }).getByRole('link', { name: /Jetzt spielen/ })).toHaveAttribute('href', '/worthaft');
  await expect(page.getByRole('link', { name: /Experiment öffnen/ })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('German page metadata and structured FAQ match visible content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://paulikreisch.de');
  const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schema = graphs.map(text => JSON.parse(text)).find(value => value['@graph']?.some((item: Record<string, string>) => item['@type'] === 'FAQPage'));
  const faq = schema['@graph'].find((item: Record<string, string>) => item['@type'] === 'FAQPage');
  for (const item of faq.mainEntity) await expect(page.locator('details')).toContainText([item.name]);
  expect(faq.mainEntity.length).toBe(await page.locator('details').count());
});

test('homepage has no automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
});

test('reduced motion disables homepage parallax', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 350));
  await expect(page.locator('[data-home-parallax]')).not.toHaveAttribute('style', /translate3d/);
});

test('old homepage remains available but cannot be indexed', async ({ page }) => {
  await page.goto('/index-old');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('header').first()).toBeVisible();
  await expect(page.locator('footer')).toHaveCount(1);
});

test('core homepage content remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:9002/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: '„Hallo Welt“ entdecken' })).toHaveAttribute('href', '/shop');
  await page.getByText('Was ist „Hallo Welt“?', { exact: true }).click();
  await expect(page.locator('details[open]')).toBeVisible();
  await context.close();
});

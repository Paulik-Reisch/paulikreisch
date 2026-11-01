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
    await expect(page.getByRole('link', { name: '„Hallo Welt“ entdecken' })).toHaveAttribute('href', '/shop');
    await expect(page.getByRole('link', { name: 'Worthaft spielen' })).toHaveAttribute('href', '/worthaft');
    await expect(page.locator('a[href="/a"], a[href^="/a/"], a[href="/artikel"], a[href^="/artikel/"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByText('Was ist „Hallo Welt“?', { exact: true }).click();
    await expect(page.locator('details[open]')).toBeVisible();
  });
}

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

test('Worthaft and Schreibstube navigation links are swapped in desktop and mobile menus', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await expect(page.locator('header nav a').nth(0)).toHaveAttribute('href', '/worthaft');
  await expect(page.locator('header nav a').nth(1)).toHaveAttribute('href', '/shop');
  await expect(page.locator('header nav a').nth(2)).toHaveAttribute('href', '/gpt');

  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('button', { name: 'Menü öffnen' }).click();
  const mobileNav = page.getByRole('dialog', { name: 'Navigation' }).locator('nav a');
  await expect(mobileNav.nth(0)).toHaveAttribute('href', '/gpt');
  await expect(mobileNav.nth(1)).toHaveAttribute('href', '/worthaft');
});

test('footer exposes the guide, newsletter and legal links', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer').last();
  await expect(footer.getByRole('link', { name: 'Ratgeber', exact: true })).toHaveAttribute('href', '/ratgeber');
  await expect(footer.getByPlaceholder('E-Mail-Adresse eingeben')).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Datenschutzerklärung' })).toHaveAttribute('href', '/datenschutz');
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

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { dailyArticle, getGuessHits, isCommonWord, normalizeWord, tokenize } from '../../src/lib/wikiland-engine';
import { WIKI_COOKIE } from '../../src/lib/wikiland-storage';

async function openGame(page: Page) {
  await page.goto('/game-labs/wikiland');
  await expect(page.getByLabel('Dein Wort', { exact: true })).toBeEnabled();
  const date = await page.evaluate(() => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()));
  return dailyArticle(date);
}
const attemptCount = (page: Page) => page.getByText('Versuche', { exact: true }).locator('..').locator('strong');

test('guesses reveal all matches, reject duplicates, resume in cookies and use no account or other storage', async ({ page, context }) => {
  const requests: string[] = [], errors: string[] = [];
  page.on('request', request => { if (/identitytoolkit|firestore.googleapis.com|securetoken|\/api\/|wikipedia\.org/.test(request.url())) requests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  const article = await openGame(page);
  const body = page.getByRole('article', { name: 'Verborgener Wikipedia-Artikel' });
  await expect(body).not.toContainText(article.title);
  const titleWords = new Set(tokenize(article.title).filter(token => token.word).map(token => token.key));
  const candidate = article.paragraphs.flatMap(tokenize).find(token => token.word && !isCommonWord(token.key) && !titleWords.has(token.key) && token.text.length >= 5)!;
  const masksBefore = await body.getByRole('img').count();
  expect(await body.getByRole('img').evaluateAll(nodes => nodes.every(node => node.textContent === '' && !node.hasAttribute('title') && !node.hasAttribute('data-word')))).toBe(true);
  await page.getByLabel('Dein Wort', { exact: true }).fill(candidate.text.toLocaleUpperCase('de'));
  await page.getByRole('button', { name: 'Raten', exact: true }).click();
  await expect(attemptCount(page)).toHaveText('1');
  await expect(body).toContainText(candidate.text);
  await expect.poll(async () => body.getByRole('img').count()).toBe(masksBefore - getGuessHits(article, candidate.text));
  await page.getByLabel('Dein Wort', { exact: true }).fill(candidate.key);
  await page.getByLabel('Dein Wort', { exact: true }).press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'schon versucht' })).toBeVisible();
  await expect(attemptCount(page)).toHaveText('1');
  await page.getByLabel('Dein Wort', { exact: true }).fill('zyxqvplmnop');
  await page.getByLabel('Dein Wort', { exact: true }).press('Enter');
  await expect(attemptCount(page)).toHaveText('2');
  await expect.poll(async () => (await context.cookies()).some(cookie => cookie.name.startsWith(WIKI_COOKIE))).toBe(true);
  await page.reload();
  await expect(attemptCount(page)).toHaveText('2');
  await page.getByText(/^Wortverlauf/).click();
  await expect(page.getByRole('button', { name: normalizeWord(candidate.text), exact: true })).toBeVisible();
  await expect(body).toContainText(candidate.text);
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

test('a full title solves the article and completed results survive reload without title-spoiling shares', async ({ page }) => {
  const article = await openGame(page);
  await page.getByLabel('Dein Wort', { exact: true }).fill(article.title);
  await page.getByLabel('Dein Wort', { exact: true }).press('Enter');
  await expect(page.getByRole('heading', { name: 'Titel gefunden!', exact: true })).toBeVisible();
  await expect(page.getByRole('article')).toContainText(article.title);
  await expect(page.getByRole('link', { name: 'Wikipedia-Artikel öffnen' })).toHaveAttribute('href', article.sourceUrl);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Titel gefunden!', exact: true })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as unknown as { copied: string }).copied = text; } } }));
  await page.getByRole('button', { name: 'Ergebnis kopieren' }).click();
  const shared = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  expect(shared).toContain('Wikiland');
  expect(shared).not.toContain(article.title);
  await page.getByRole('button', { name: 'Nächste freie Runde' }).click();
  await expect(page.getByLabel('Dein Wort', { exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Freie Runde', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('hints, mode replacement confirmations and give-up remain distinct from winning', async ({ page }) => {
  const article = await openGame(page);
  await page.getByRole('button', { name: 'Hinweis', exact: true }).click();
  await expect(page.getByText('Hinweise', { exact: true }).locator('..').locator('strong')).toHaveText('1');
  await expect(page.getByRole('status').filter({ hasText: /^Hinweis:/ })).toBeVisible();
  await page.getByRole('button', { name: 'Freie Runde', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByRole('button', { name: 'Weiterraten', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tagesrätsel', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Aufdecken', exact: true }).click();
  await page.getByRole('button', { name: 'Artikel aufdecken', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Artikel aufgedeckt', exact: true })).toBeVisible();
  await expect(page.getByRole('article')).toContainText(article.title);
  await expect(page.getByRole('heading', { name: 'Titel gefunden!', exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Artikel aufgedeckt', exact: true })).toBeVisible();
});

for (const width of [320, 390, 1440]) {
  test(`layout and accessible redactions work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await openGame(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const inputBox = await page.getByLabel('Dein Wort', { exact: true }).boundingBox();
    expect(inputBox?.x).toBeGreaterThanOrEqual(0);
    expect((inputBox?.x ?? 0) + (inputBox?.width ?? 0)).toBeLessThanOrEqual(width);
    if (width === 390) {
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(result.violations).toEqual([]);
    }
    await page.screenshot({ path: `test-results/wikiland-${width}.png`, fullPage: true });
  });
}

test('rules/source dialogs restore focus, expose attribution without title text and pause time', async ({ page }) => {
  const article = await openGame(page);
  const help = page.getByRole('button', { name: 'Spielregeln öffnen' });
  await help.click();
  const dialog = page.getByRole('dialog', { name: 'So spielst du Wikiland' });
  await expect(dialog).toBeVisible();
  const timer = page.getByText('Spielzeit', { exact: true }).locator('..').locator('strong');
  const timeBefore = await timer.textContent();
  await page.waitForTimeout(1200);
  await expect(timer).toHaveText(timeBefore!);
  await page.keyboard.press('Escape');
  await expect(help).toBeFocused();
  const source = page.getByRole('button', { name: 'Quelle & Lizenz', exact: true });
  await source.click();
  const sources = page.getByRole('dialog', { name: 'Quelle & Lizenz', exact: true });
  await expect(sources).not.toContainText(article.title);
  await expect(sources.getByRole('link', { name: /Wikipedia-Original/ })).toHaveAttribute('href', article.sourceUrl);
  await expect(sources.getByRole('link', { name: 'Creative Commons BY-SA 4.0' })).toBeVisible();
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(source).toBeFocused();
});

test('corrupt and blocked cookies still allow a playable round', async ({ page, context }) => {
  await context.addCookies([{ name: `${WIKI_COOKIE}_0`, value: 'corrupt', domain: '127.0.0.1', path: '/game-labs/wikiland' }]);
  await openGame(page);
  await page.addInitScript(() => Object.defineProperty(document, 'cookie', { configurable: true, get: () => '', set: () => undefined }));
  await page.reload();
  await expect(page.getByText(/Dein Fortschritt lässt sich gerade nicht speichern/)).toBeVisible();
  await page.getByRole('button', { name: 'Hinweis', exact: true }).click();
  await expect(page.getByText('Hinweise', { exact: true }).locator('..').locator('strong')).toHaveText('1');
});

test('Wikiland is linked from Game Labs and navigates back without provider errors', async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => localStorage.setItem('hallowelt_cookie_consent', '{}'));
  await page.goto('/game-labs');
  await page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Wikiland', exact: true }) }).getByRole('link').click();
  await expect(page.getByLabel('Dein Wort', { exact: true })).toBeEnabled();
  await page.getByRole('link', { name: 'Zu Game Labs', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Was spielen wir heute?' })).toBeVisible();
});

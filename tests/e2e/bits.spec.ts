import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { generatePuzzle } from '../../src/lib/bits-engine';
import { BITS_COOKIE, parseBitsState, serializeBitsState, type SavedBits } from '../../src/lib/bits-storage';

test('Game Labs links to Bits and client navigation restores the site providers', async ({ page }) => {
  const errors: string[] = [];
  // This test intentionally blocks the existing site's anonymous auth network calls.
  page.on('pageerror', error => { if (error.message !== 'Firebase: Error (auth/network-request-failed).') errors.push(error.message); });
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => localStorage.setItem('hallowelt_cookie_consent', '{}'));
  await page.goto('/game-labs');
  await page.getByRole('article').filter({ has: page.getByRole('heading', { name: 'Bits', exact: true }) }).getByRole('link').click();
  await expect(page.getByRole('group', { name: '6 mal 6 Spielfeld' })).toBeVisible();
  await page.getByRole('link', { name: 'Game Labs', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Was spielen wir heute?' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('cycles bits, protects clues, supports keyboard/undo and resumes from cookie without accounts', async ({ page, context }) => {
  const external: string[] = [];
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/identitytoolkit|firestore.googleapis.com|securetoken|\/api\//.test(request.url())) external.push(request.url()); });
  await page.goto('/game-labs/bits');
  const board = page.getByRole('group', { name: '6 mal 6 Spielfeld' });
  await expect(board).toBeVisible();
  const clue = board.getByRole('button', { name: /Vorgabe/ }).first();
  const clueName = await clue.getAttribute('aria-label');
  await clue.press('0');
  await expect(clue).toHaveAttribute('aria-label', clueName!);
  const cell = board.getByRole('button', { name: /leer/ }).first();
  const coordinates = (await cell.getAttribute('aria-label'))!.split(':')[0];
  const target = board.getByRole('button', { name: new RegExp(`^${coordinates}:`) });
  await target.click();
  await expect(target).toHaveAttribute('aria-label', `${coordinates}: 0`);
  await target.click();
  await expect(target).toHaveAttribute('aria-label', `${coordinates}: 1`);
  await target.click();
  await expect(target).toHaveAttribute('aria-label', `${coordinates}: leer`);
  await target.press('1');
  await page.getByRole('button', { name: 'Zurück', exact: true }).click();
  await expect(target).toHaveAttribute('aria-label', `${coordinates}: leer`);
  await target.press('0');
  await expect.poll(async () => (await context.cookies()).some(cookie => cookie.name === BITS_COOKIE)).toBe(true);
  await page.reload();
  await expect(target).toHaveAttribute('aria-label', `${coordinates}: 0`);
  await target.focus();
  await target.press('ArrowRight');
  await expect(target).not.toBeFocused();
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

for (const width of [320, 390, 1440]) {
  test(`all sizes fit at ${width}px and expose accessible controls`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/game-labs/bits');
    await expect(page.getByRole('group', { name: '6 mal 6 Spielfeld' })).toBeVisible();
    for (const size of [4, 6, 8]) {
      await page.getByRole('button', { name: `${size} × ${size}`, exact: true }).click();
      await expect(page.getByRole('group', { name: `${size} mal ${size} Spielfeld` }).getByRole('button')).toHaveCount(size * size);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    if (width === 390) {
      const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(accessibility.violations).toEqual([]);
    }
    await page.screenshot({ path: `test-results/bits-${width}.png`, fullPage: true });
  });
}

test('confirmation protects progress; hints, reset, win and cookie deletion work', async ({ page, context }) => {
  await page.goto('/game-labs/bits');
  await page.getByRole('button', { name: 'Hinweis', exact: true }).click();
  await expect(page.getByText('1 Hinweis', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '4 × 4', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toBeVisible();
  await page.getByRole('button', { name: 'Weiterspielen', exact: true }).click();
  await expect(page.getByRole('group', { name: '6 mal 6 Spielfeld' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('button', { name: 'Zurücksetzen', exact: true }).click();
  await expect(page.getByText('0 Hinweise', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '4 × 4', exact: true }).click();
  await expect(page.getByRole('group', { name: '4 mal 4 Spielfeld' })).toBeVisible();
  for (let step = 0; step < 16 && await page.getByRole('button', { name: 'Hinweis', exact: true }).isEnabled(); step++) {
    await page.getByRole('button', { name: 'Hinweis', exact: true }).click();
  }
  await expect(page.getByText('Bit für Bit. Geschafft!', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Bit für Bit. Geschafft!', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Spielstand löschen', exact: true }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Spielstand löschen', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Speichern aktivieren' })).toBeVisible();
  await page.getByRole('button', { name: 'Noch eine Runde' }).click();
  await page.waitForTimeout(1200);
  expect((await context.cookies()).find(cookie => cookie.name === BITS_COOKIE)).toBeUndefined();
  await page.getByRole('button', { name: 'Speichern aktivieren' }).click();
  await expect.poll(async () => (await context.cookies()).some(cookie => cookie.name === BITS_COOKIE)).toBe(true);
});

test('corrupt cookies recover and blocked cookies still permit playing', async ({ page, context }) => {
  await context.addCookies([{ name: BITS_COOKIE, value: '%broken', domain: '127.0.0.1', path: '/game-labs/bits' }]);
  await page.goto('/game-labs/bits');
  await expect(page.getByRole('group', { name: '6 mal 6 Spielfeld' })).toBeVisible();
  await expect.poll(async () => parseBitsState((await context.cookies()).find(cookie => cookie.name === BITS_COOKIE)?.value ?? '') !== null).toBe(true);
  await page.addInitScript(() => Object.defineProperty(document, 'cookie', { configurable: true, get: () => '', set: () => undefined }));
  await page.reload();
  await expect(page.getByText(/Speichern ist in diesem Browser nicht möglich/)).toBeVisible();
  await page.getByRole('button', { name: 'Hinweis', exact: true }).click();
  await expect(page.getByText('1 Hinweis', { exact: true })).toBeVisible();
});

test('rule check marks conflicting entries and a reload preserves timer and undo', async ({ page, context }) => {
  const puzzle = generatePuzzle(4, 'e2e-conflicts');
  const state: SavedBits = { version: 1, puzzle, board: [...puzzle.givens], elapsed: 125, hints: 0, history: [], completed: false };
  await context.addCookies([{ name: BITS_COOKIE, value: serializeBitsState(state), domain: '127.0.0.1', path: '/game-labs/bits' }]);
  await page.goto('/game-labs/bits');
  await expect(page.getByLabel(/Spielzeit 02:/)).toBeVisible();
  const board = page.getByRole('group', { name: '4 mal 4 Spielfeld' });
  for (let index = 0; index < puzzle.givens.length; index++) {
    if (puzzle.givens[index] === -1) await board.getByRole('button').nth(index).press('0');
  }
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(board.locator('[data-invalid="true"]').first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Zurück', exact: true })).toBeEnabled();
});

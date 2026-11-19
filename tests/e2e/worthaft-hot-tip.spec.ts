import { test, expect } from '@playwright/test';

test('the hot tip marks a solution key without writing in the grid and shares its attempt', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('hallowelt_cookie_consent', '{}');
    const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    if (!localStorage.getItem('worthaft-daily-game')) {
      localStorage.setItem('worthaft-daily-game', JSON.stringify({
        date, status: 'playing',
        guesses: Array(5).fill({ guess: 'ABCDE', statuses: Array(5).fill('absent') }),
        letterStatuses: { Q: 'absent' },
      }));
    }
    Object.defineProperty(navigator, 'share', {
      value: async ({ text }: { text: string }) => sessionStorage.setItem('shared-result', text),
    });
  });
  await page.goto('/worthaft');
  const keyboard = page.getByTestId('worthaft-keyboard');
  const grid = page.getByTestId('worthaft-grid');
  const tip = keyboard.getByRole('button', { name: /Heißer Tipp/ });
  const markedKey = keyboard.locator('.worthaft-tip-key');

  await expect(keyboard.getByRole('button', { name: 'Q', exact: true })).toHaveCSS('opacity', '0.2');
  await page.keyboard.type('st');
  const typed = await grid.textContent();
  await tip.click();
  await page.getByRole('button', { name: 'Tipp verwenden' }).click();
  await expect(markedKey).toHaveCount(1);
  const letter = await markedKey.innerText();
  await expect(grid).toHaveText(typed!);
  await expect(tip).toHaveCount(0);
  expect(await markedKey.evaluate(button => getComputedStyle(button, '::after').animationName)).toBe('worthaft-tip-orbit');
  await page.screenshot({ path: 'test-results/worthaft-hot-tip.png' });

  await page.reload();
  await expect(markedKey).toHaveText(letter);
  await expect(tip).toHaveCount(0);
  await page.keyboard.type('stern');
  await keyboard.getByRole('button', { name: 'Wort prüfen' }).click();
  await page.getByRole('button', { name: 'Überspringen', exact: true }).click();
  await expect(page.getByText(/Das heutige Wort:/)).toContainText(letter);
  await page.getByRole('button', { name: 'Teilen', exact: true }).click();
  const shared = await page.evaluate(() => sessionStorage.getItem('shared-result'));
  expect(shared).toContain('Heißer Tipp in Versuch 6 verwendet.');
  expect(shared).toMatch(/^[🟩🟦🟨⬛]{5}(?: \(\d+:\d{2}\))?$/mu);
});

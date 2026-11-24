import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, r => r.abort());
  await page.addInitScript(() => {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
  });
});

test('sixth losing row time is present immediately and after reload', async ({ page }) => {
  await page.addInitScript(() => {
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
    if (!localStorage.getItem('worthaft-daily-game')) localStorage.setItem('worthaft-daily-game', JSON.stringify({date, status: 'playing', guesses: Array(5).fill({guess: 'STERN', statuses: Array(5).fill('absent')}), letterStatuses: {}, rowTimes: [1000, 1000, 1000, 1000, 1000]}));
    localStorage.setItem(`worthaft-feedback-${date}`, 'skipped');
    Object.defineProperty(navigator, 'share', {configurable: true, value: async (data: ShareData) => { (window as unknown as {auditShare: ShareData}).auditShare = data; }});
  });
  await page.goto('/worthaft');
  await expect(page.getByTestId('worthaft-grid')).toContainText('S', {timeout: 30000});
  for (const key of 'STERN') await page.getByRole('button', {name:key,exact:true}).click();
  await page.waitForTimeout(2200); // Real active row time must accrue before submission.
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', {name:'Leider verloren!',exact:true});
  await expect(dialog).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('worthaft-daily-game')!));
  expect(stored.rowTimes).toHaveLength(6);
  expect(stored.rowTimes[5]).toBeGreaterThanOrEqual(2000);
  const seconds = Math.floor(stored.rowTimes.reduce((a:number,b:number)=>a+b,0)/1000);
  const duration = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
  await expect(dialog).toContainText(duration);
  await dialog.getByRole('button', {name:'Teilen',exact:true}).click();
  const shared = await page.evaluate(() => (window as unknown as {auditShare: ShareData}).auditShare.text);
  expect(shared).toContain(`innerhalb von ${duration} Minuten`);
  expect(shared?.split('\n').filter(line => line.includes('⬛') || line.includes('🟩') || line.includes('🟨'))).toHaveLength(6);

  await page.reload();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(duration);
});

test('newsletter confirm and unsubscribe states stay safe and functional with mocked submits', async ({ page }) => {
  for (const [path,button,done] of [['confirm','Ja, Newsletter senden','Anmeldung bestätigt'],['unsubscribe','Jetzt abmelden','Du bist abgemeldet']]) {
    let requests=0;
    await page.route(`**/nl/${path}/${path==='confirm'?'submit':'confirm'}`, async r => {requests++; await r.fulfill({json:{ok:true}});});
    await page.goto(`/nl/${path}?t=local-fixture-only`);
    expect(requests).toBe(0);
    await page.getByRole('button',{name:button,exact:true}).click();
    await expect(page.getByRole('heading',{name:done,exact:true})).toBeVisible();
    expect(requests).toBe(1);
    await expect(page.getByRole('link',{name:'Zur Startseite',exact:true})).toHaveAttribute('href','/');
  }
});

test('sitemap metadata, links, keyboard expansion and authors heading', async ({ page }) => {
  await page.goto('/sitemap');
  await expect(page).toHaveTitle('Sitemap | Paulik & Reisch');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://paulikreisch.de/sitemap');
  await expect(page.locator('main a[href="/game-labs/bits"]')).toBeVisible();
  const collapse=page.getByRole('button',{name:'Game Labs (Alpha): einklappen'});
  await collapse.focus();await page.keyboard.press('Enter');
  await expect(page.locator('main a[href="/game-labs/bits"]')).toHaveCount(0);
  await page.getByRole('button',{name:'Game Labs (Alpha): aufklappen'}).click();
  await expect(page.locator('main a[href="/game-labs/bits"]')).toBeVisible();
  await expect(page.locator('main')).not.toContainText('Merchandise');
  await expect(page.locator('main a[href^="/autoren/"]')).toHaveCount(0);
  await page.goto('/ueber/autoren');
  await expect(page.locator('h1')).toHaveText('Die Menschen hinter dem Wahnsinn.');
});


test('XML sitemap includes approved pages and excludes retired or noindex routes', async ({ request }) => {
  const response = await request.get('/sitemap.xml');
  expect(response.ok()).toBe(true);
  const xml = await response.text();
  expect(xml).toContain('https://paulikreisch.de/gpt</loc>');
  expect(xml).not.toContain('/autoren/');
  expect(xml).not.toContain('/game-labs');
});

test('retired author routes return 404 without removing current author pages', async ({ request }) => {
  for (const slug of ['max-reisch', 'philipp-paulik', 'luin-schiffbauer']) {
    expect((await request.get(`/autoren/${slug}`)).status()).toBe(404);
    expect((await request.get(`/ueber/${slug}`)).status()).toBe(200);
  }
});

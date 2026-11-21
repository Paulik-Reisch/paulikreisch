import { test, expect, type Page } from '@playwright/test';

// Auth responses are mocked, so these tests never create real Firebase accounts.
async function mockOnDemandAnonymousAuth(page: Page) {
  let requests = 0;
  const uid = 'e2e-suggestion-vote-user';
  const encode = (data: object) => Buffer.from(JSON.stringify(data)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const token = `${encode({ alg: 'none', typ: 'JWT' })}.${encode({
    sub: uid, user_id: uid, iat: now, exp: now + 3600,
    aud: 'hallo-welt-paulik-reisch',
    iss: 'https://securetoken.google.com/hallo-welt-paulik-reisch',
    firebase: { identities: {}, sign_in_provider: 'anonymous' },
  })}.test-signature`;
  await page.route('**/identitytoolkit.googleapis.com/v1/accounts:signUp*', route => {
    requests++;
    return route.fulfill({ json: { kind: 'identitytoolkit#SignupNewUserResponse', localId: uid,
      idToken: token, refreshToken: 'e2e-refresh-token', expiresIn: '3600' } });
  });
  await page.route('**/identitytoolkit.googleapis.com/v1/accounts:lookup*', route =>
    route.fulfill({ json: { users: [{ localId: uid, providerUserInfo: [],
      createdAt: String(Date.now()), lastLoginAt: String(Date.now()) }] } }));
  return () => requests;
}

async function openSuggestionPopup(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(() => {
    localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }));
  });
  await page.goto('/worthaft');
  await expect(page.getByTestId('worthaft-grid')).toBeVisible();
  await page.keyboard.type('xxxxx');
  await page.keyboard.press('Enter');
  await expect(page.getByText('„XXXXX“ ist ein ungültiges Wort', { exact: true })).toBeVisible();
}

for (const width of [375, 1440]) {
  test(`declining a word suggestion stores nothing at ${width}px`, async ({ page }) => {
    let backendRequests = 0;
    await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => {
      backendRequests++;
      return route.abort();
    });
    await openSuggestionPopup(page, width);
    await page.getByRole('button', { name: 'Nein', exact: true }).click();
    await expect(page.getByText('„XXXXX“ ist ein ungültiges Wort', { exact: true })).toHaveCount(0);
    await page.waitForTimeout(500);
    expect(backendRequests).toBe(0);
  });
}

test('accepting a word suggestion signs in and attempts the save at 375px', async ({ page }) => {
  const getAuthRequests = await mockOnDemandAnonymousAuth(page);
  let firestoreRequests = 0;
  await page.route(/firestore.googleapis.com/, route => {
    firestoreRequests++;
    return route.abort();
  });
  await openSuggestionPopup(page, 375);
  expect(firestoreRequests).toBe(0);
  expect(getAuthRequests()).toBe(0);
  await page.getByRole('button', { name: 'Ja', exact: true }).click();
  await expect.poll(() => firestoreRequests, { timeout: 15000 }).toBeGreaterThan(0);
  expect(getAuthRequests()).toBe(1);
});

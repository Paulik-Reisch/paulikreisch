import { test, expect } from '@playwright/test';
import { customFrame } from '../../src/marketing/custom.mjs';

test('opaque custom preview sends height and scroll updates to its embedding origin', async ({ page }) => {
  await page.goto('/game-labs');
  const frame = customFrame({ files: [], code: { html: '<div style="height:1200px"></div><a href="https://paulikreisch.de/shop">Zum Shop</a>', css: '', js: '' } }, { preview: true });
  await page.setContent(`<!doctype html><html><body><script>window.frameEvents=[];window.addEventListener('message',e=>{if(e.source===document.querySelector('iframe').contentWindow)window.frameEvents.push(e.data)});</script>${frame}</body></html>`);
  await expect.poll(() => page.evaluate(() => (window as unknown as { frameEvents: Array<{__prCustomFrame:string}> }).frameEvents.some(event => event.__prCustomFrame === 'height'))).toBe(true);
  const child = page.frameLocator('iframe[title="Customseite"]');
  await child.getByRole('link', { name: 'Zum Shop' }).click();
  await expect(child.getByRole('dialog', { name: 'Linkziel in der privaten Vorschau' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as unknown as { frameEvents: Array<{__prCustomFrame:string}> }).frameEvents.some(event => event.__prCustomFrame === 'scroll'))).toBe(true);
});

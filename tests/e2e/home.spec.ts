import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  // Tests never send newsletter requests or create production Firebase accounts.
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, route => route.abort());
  await page.addInitScript(() => localStorage.setItem('hallowelt_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false })));
});

for (const width of [320, 375, 414, 768, 1440]) {
  test(`homepage fits ${width}px and all primary actions remain visible`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Schule aus.Satire an.');
    await expect(page.getByText('Paulik & Reisch · Literatur mit Nebenwirkungen')).toHaveCount(0);
    await expect(page.getByText('Für alle, die nicht alles ernst nehmen.')).toHaveCount(0);
    await expect(page.getByRole('link', { name: '„Hallo Welt“ entdecken' })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByText('Was ist „Hallo Welt“?', { exact: true }).click();
    await expect(page.locator('details[open]')).toContainText('36 Kapiteln');
    const faqIndent = await page.locator('details[open]').evaluate(details => {
      const summary = details.querySelector('summary');
      const answer = details.querySelector('p');
      if (!summary || !answer) throw new Error('Open FAQ is missing its summary or answer');
      return answer.getBoundingClientRect().left - summary.getBoundingClientRect().left;
    });
    expect(faqIndent).toBe(20);
    await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, 0); });
    await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
  });
}

test('mobile menu opens and closes on Escape', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menü öffnen' }).click();
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
});

test('footer columns align and newsletter is not boxed in', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const footer = page.locator('footer').last();
  await expect(footer.getByRole('heading', { name: 'Buch kaufen', exact: true })).toHaveCount(0);
  const headingTops = await Promise.all(['Entdecken', 'Kontakt', 'Newsletter'].map(name =>
    footer.getByRole('heading', { name, exact: true }).evaluate(heading => heading.getBoundingClientRect().top)
  ));
  expect(new Set(headingTops).size).toBe(1);
  const headingGaps = await Promise.all(['Entdecken', 'Kontakt', 'Newsletter'].map(async name => {
    const heading = footer.getByRole('heading', { name, exact: true });
    const content = heading.locator('xpath=following-sibling::*[1]');
    const headingBottom = await heading.evaluate(element => element.getBoundingClientRect().bottom);
    const contentTop = await content.evaluate(element => element.getBoundingClientRect().top);
    return contentTop - headingBottom;
  }));
  expect(headingGaps).toEqual([16, 16, 16]);
  const newsletterCard = footer.getByRole('heading', { name: 'Newsletter', exact: true }).locator('..');
  const cardStyles = await newsletterCard.evaluate(element => {
    const styles = getComputedStyle(element);
    return { border: styles.borderTopWidth, radius: styles.borderTopLeftRadius, background: styles.backgroundColor };
  });
  expect(cardStyles).toEqual({ border: '0px', radius: '0px', background: 'rgba(0, 0, 0, 0)' });
  const headerButton = page.getByRole('banner').getByRole('link', { name: 'Worthaft' });
  const footerButton = footer.getByRole('link', { name: 'Worthaft' });
  const sharedButtonStyles = async (button: typeof headerButton) => button.evaluate(element => {
    const styles = getComputedStyle(element);
    return {
      borderColor: styles.borderTopColor,
      borderWidth: styles.borderTopWidth,
      borderRadius: styles.borderTopLeftRadius,
      boxShadow: styles.boxShadow,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
    };
  });
  expect(await sharedButtonStyles(footerButton)).toEqual(await sharedButtonStyles(headerButton));
});

test('footer places Amazon below Worthaft and aligns the newsletter field with consent text', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  const footer = page.locator('footer').last();
  const grid = footer.locator('.container').first();
  const columns = grid.locator(':scope > div');
  const amazon = footer.getByRole('link', { name: 'Amazon' });
  const discover = footer.getByRole('heading', { name: 'Entdecken', exact: true }).locator('..');
  const wordhaft = footer.getByRole('link', { name: 'Worthaft' });
  const ratgeber = footer.getByRole('link', { name: 'Ratgeber', exact: true });
  const contact = footer.getByRole('heading', { name: 'Kontakt', exact: true }).locator('..');
  await expect(columns).toHaveCount(4);
  await expect(amazon).toHaveCount(1);
  await expect(discover.getByRole('link', { name: 'Amazon' })).toHaveCount(1);
  await expect(contact.getByRole('link', { name: 'Über die Autoren' })).toHaveCount(1);
  await expect(contact).not.toContainText('Neunkirchen');
  const amazonTop = await amazon.evaluate(element => element.getBoundingClientRect().top);
  const wordhaftTop = await wordhaft.evaluate(element => element.getBoundingClientRect().top);
  expect(amazonTop).toBeGreaterThan(wordhaftTop);
  const ratgeberTop = await ratgeber.evaluate(element => element.getBoundingClientRect().top);
  expect(ratgeberTop).toBeGreaterThan(amazonTop);
  await expect(ratgeber).toHaveAttribute('href', '/ratgeber');
  const buttonSizes = await Promise.all([wordhaft, amazon, ratgeber].map(button => button.evaluate(element => {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  })));
  expect(buttonSizes[0].height).toBe(buttonSizes[1].height);
  expect(buttonSizes[1].height).toBe(buttonSizes[2].height);
  const discoverWidth = await discover.evaluate(element => element.getBoundingClientRect().width);
  expect(buttonSizes.every(({ width }) => width < discoverWidth)).toBe(true);
  await expect(wordhaft.locator('svg')).toHaveCount(1);
  await expect(amazon.locator('svg')).toHaveCount(1);
  await expect(ratgeber.locator('svg')).toHaveCount(1);
  const buttonColors = await Promise.all([wordhaft, amazon, ratgeber].map(button => button.evaluate(element => getComputedStyle(element).backgroundColor)));
  expect(buttonColors).toEqual(['rgb(255, 255, 255)', 'rgb(255, 225, 77)', 'rgb(34, 117, 211)']);
  const emailBounds = await footer.getByPlaceholder('E-Mail-Adresse eingeben').evaluate(element => {
    const { left, right } = element.getBoundingClientRect();
    return { left, right };
  });
  const consentTextBounds = await footer.locator('label').filter({ hasText: 'Datenschutzerklärung' }).locator('span').evaluate(element => {
    const { left, right } = element.getBoundingClientRect();
    return { left, right };
  });
  expect(Math.abs(emailBounds.left - consentTextBounds.left)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(emailBounds.right - consentTextBounds.right)).toBeLessThanOrEqual(0.5);
  const consentTextDoesNotWrapOnDesktop = await footer.locator('label').filter({ hasText: 'Datenschutzerklärung' }).locator('span').evaluate(element =>
    getComputedStyle(element).whiteSpace === 'nowrap'
  );
  expect(consentTextDoesNotWrapOnDesktop).toBe(true);
  const columnWidths = await Promise.all(Array.from({ length: 4 }, (_, index) =>
    columns.nth(index).evaluate(element => element.getBoundingClientRect().width)
  ));
  expect(Math.max(...columnWidths) - Math.min(...columnWidths)).toBeLessThanOrEqual(0.5);
  const columnLefts = await Promise.all(Array.from({ length: 4 }, (_, index) =>
    columns.nth(index).evaluate(element => element.getBoundingClientRect().left)
  ));
  for (let index = 1; index < columnLefts.length; index += 1) {
    expect(columnLefts[index]).toBeGreaterThan(columnLefts[index - 1]);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  const mobileEmailBounds = await footer.getByPlaceholder('E-Mail-Adresse eingeben').evaluate(element => {
    const { left, right } = element.getBoundingClientRect();
    return { left, right };
  });
  const mobileConsentTextBounds = await footer.locator('label').filter({ hasText: 'Datenschutzerklärung' }).locator('span').evaluate(element => {
    const { left, right } = element.getBoundingClientRect();
    return { left, right };
  });
  expect(Math.abs(mobileEmailBounds.left - mobileConsentTextBounds.left)).toBeLessThanOrEqual(0.5);
  expect(Math.abs(mobileEmailBounds.right - mobileConsentTextBounds.right)).toBeLessThanOrEqual(0.5);
  const mobileConsentTextWrapsNaturally = await footer.locator('label').filter({ hasText: 'Datenschutzerklärung' }).locator('span').evaluate(element =>
    getComputedStyle(element).whiteSpace === 'normal'
  );
  expect(mobileConsentTextWrapsNaturally).toBe(true);
});

test('German content, canonical URL and structured data match the visible FAQ', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang','de');
  await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://paulikreisch.de');
  const graphs = await page.locator('script[type="application/ld+json"]').allTextContents();
  const schema = graphs.map(text => JSON.parse(text)).find(value => value['@graph']?.some((item: Record<string,string>) => item['@type'] === 'FAQPage'));
  const faq = schema['@graph'].find((item: Record<string,string>) => item['@type'] === 'FAQPage');
  for (const item of faq.mainEntity) await expect(page.locator('details')).toContainText([item.name]);
  expect(faq.mainEntity.length).toBe(await page.locator('details').count());
});

test('complete homepage has no automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(result.violations).toEqual([]);
});

test('reduced motion disables parallax', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, 350));
  await expect(page.locator('[data-home-parallax]')).not.toHaveAttribute('style', /translate3d/);
});

test('old homepage remains available and cannot be indexed', async ({ page }) => {
  await page.goto('/index-old');
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', /noindex/);
  await expect(page.locator('header').first()).toBeVisible();
  await expect(page.locator('footer')).toHaveCount(1);
});

test('core content and FAQ remain usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:9002/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Schule aus.Satire an.');
  await expect(page.getByRole('link', { name: '„Hallo Welt“ entdecken' })).toHaveAttribute('href', '/shop');
  await page.getByText('Was ist „Hallo Welt“?', { exact: true }).click();
  await expect(page.locator('details[open]')).toContainText('106 Seiten');
  await context.close();
});

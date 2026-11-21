import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test.beforeEach(async({page})=>{await page.addInitScript(()=>{localStorage.setItem('theme','light');localStorage.setItem('hallowelt_cookie_consent',JSON.stringify({necessary:true,analytics:false,marketing:false}));});});
test('instruction metadata and step URLs use its own route',async({page})=>{
 await page.goto('/worthaft/ueber');await expect(page).toHaveTitle(/Spielanleitung/);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://paulikreisch.de/worthaft/ueber');
 const howto=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.map(n=>JSON.parse(n.textContent!)).find(n=>n['@type']==='HowTo'));
 expect(howto.step).toHaveLength(3);for(const step of howto.step)expect(step.url).toBe('https://paulikreisch.de/worthaft/ueber#regeln');
});
test('sitemap omits the nonexistent tutorial',async({page})=>{await page.goto('/sitemap');await expect(page.locator('a[href="/vibecoding/anleitung"]')).toHaveCount(0);});
test('shop no longer invents offers, ratings or placeholders',async({page})=>{
 await page.goto('/shop');const records=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.map(n=>JSON.parse(n.textContent!)).filter(n=>n['@type']==='Book'));
 expect(records).toHaveLength(2);for(const book of records){expect(book.offers).toBeUndefined();expect(book.aggregateRating).toBeUndefined();expect(book.description).not.toContain('Platzhalter');}
 await expect(page.getByText(/Lies beide Bände|Platzhalter|5,0 von 5/)).toHaveCount(0);
 await expect(page.locator('meta[name="description"]')).not.toHaveAttribute('content',/10,99|20,99|5★|Monatsende/);
});
for(const route of ['/gpt','/shop'])test(`${route} small texts meet contrast in light and dark`,async({page})=>{
 await page.setViewportSize({width:390,height:900});await page.goto(route);
 for(const theme of ['light','dark']){await page.evaluate(theme=>document.documentElement.classList.toggle('dark',theme==='dark'),theme);await page.waitForTimeout(200);
 const scan=await new AxeBuilder({page}).withRules(['color-contrast']).analyze();
 const relevant=scan.violations.flatMap(v=>v.nodes).filter(n=>route==='/gpt'?n.target.some(t=>String(t).includes('disclaimer')||String(t).includes('composerBottom')):n.target.some(t=>String(t).includes('link-leseprobe')));
 expect(relevant,JSON.stringify(relevant)).toHaveLength(0);
 }
});
test('retired checklist and PDF return 404 without a redirect',async({page})=>{
 for(const path of ['/checkliste','/checkliste-lernvollzugsanstalt.pdf']){const response=await page.goto(path);expect(response?.status()).toBe(404);expect(new URL(page.url()).pathname).toBe(path);}
});

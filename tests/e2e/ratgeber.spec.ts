import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { guidePillars, getGuideArticles } from '../../src/lib/ratgeber/registry';

test.beforeEach(async({page})=>{
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/,route=>route.abort());
  await page.addInitScript(()=>localStorage.setItem('hallowelt_cookie_consent',JSON.stringify({necessary:true,analytics:false,marketing:false})));
});

test('all 119 planned articles render with canonical metadata, one H1 and matching FAQ schema',async({request})=>{
  test.setTimeout(300000);
  const entries=guidePillars.flatMap(pillar=>getGuideArticles(pillar.slug).map(article=>({pillar,article})));
  // Let the development server compile each new route before checking the next.
  for(const {pillar,article} of entries){
      const path=`/ratgeber/${pillar.slug}/${article.slug}`;
      const response=await request.get(path);
      expect(response.status(),path).toBe(200);
      const html=await response.text();
      expect((html.match(/<h1\b/g)??[]).length,path).toBe(1);
      expect(html,path).toContain(`rel="canonical" href="https://paulikreisch.de${path}"`);
      const graphs=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
      const graph=graphs.find(value=>value['@graph']?.some((item:Record<string,unknown>)=>item['@type']==='Article'))?.['@graph'];
      expect(graph,path).toBeTruthy();
      const schemaArticle=graph.find((item:Record<string,unknown>)=>item['@type']==='Article');
      expect(schemaArticle.headline,path).toBe(article.title);
      const faq=graph.find((item:Record<string,unknown>)=>item['@type']==='FAQPage');
      expect(faq.mainEntity.map((item:{name:string})=>item.name),path).toEqual(article.faqs.map(item=>item.question));
      expect(html,path).not.toMatch(/CLUSTER-PLAN|PROMO-HOOKS|VERLINKUNGS-PFLICHTEN/);
  }
});

for(const width of [320,375,414,768,1440]){
  test(`Ratgeber index, pillar and article fit ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:1000});
    for(const path of ['/ratgeber','/ratgeber/satire-schreiben','/ratgeber/zeugnissprache/zeugnis-formulierungen-liste']){
      await page.goto(path);
      await expect(page.locator('main h1')).toHaveCount(1);
      await expect(page.locator('main h1')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);
      await page.screenshot({path:`test-results/ratgeber-${path.split('/').filter(Boolean).join('-')}-${width}.png`,fullPage:true});
    }
    const faq=page.locator('main details').first();
    await faq.locator('summary').click();
    await expect(faq).toHaveAttribute('open','');
    await page.getByRole('navigation',{name:'Brotkrumennavigation'}).getByRole('link',{name:'Zeugnissprache verstehen'}).click();
    await expect(page).toHaveURL(/\/ratgeber\/zeugnissprache$/);
  });
}

test('all ten pillar topic directories link to their exact planned children',async({page})=>{
  test.setTimeout(180000);
  for(const pillar of guidePillars){
    await page.goto(`/ratgeber/${pillar.slug}`);
    const article=page.getByRole('article',{name:pillar.title});
    for(const child of getGuideArticles(pillar.slug)) await expect(article.getByRole('heading',{level:2}).getByRole('link',{name:child.title,exact:true})).toHaveAttribute('href',`/ratgeber/${pillar.slug}/${child.slug}`);
  }
});

test('Ratgeber works without JavaScript, invalid topics return 404, and XML includes clusters',async({browser,request})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:9002/ratgeber/etikette/tischmanieren-regeln');
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('main article')).toContainText(getGuideArticles('etikette').find(article=>article.slug==='tischmanieren-regeln')!.answer);
  await page.locator('main details summary').first().click();
  await expect(page.locator('main details').first()).toHaveAttribute('open','');
  await context.close();
  expect((await request.get('/ratgeber/etikette/diesen-artikel-gibt-es-nicht')).status()).toBe(404);
  const sitemap=await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  const xml=await sitemap.text();
  for(const pillar of guidePillars) for(const article of getGuideArticles(pillar.slug)) expect(xml).toContain(`https://paulikreisch.de/ratgeber/${pillar.slug}/${article.slug}`);
});

test('legacy wiki pages redirect to the Ratgeber',async({page})=>{
  await page.goto('/wiki/satire-landschaft');
  await expect(page).toHaveURL(/\/ratgeber$/);
  await expect(page.getByRole('heading',{name:/Ratgeber fürs/})).toBeVisible();
});

test('Ratgeber index and representative article have no automated accessibility violations',async({page})=>{
  for(const path of ['/ratgeber','/ratgeber/geschenk-lehrer/duerfen-lehrer-geschenke-annehmen']){
    await page.goto(path);
    const result=await new AxeBuilder({page}).include('main').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(result.violations,path).toEqual([]);
  }
});

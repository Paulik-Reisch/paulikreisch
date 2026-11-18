import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {renderPage, PUBLIC_HEADERS} from '../../../src/marketing/render.mjs';

const browser = await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
const target = 'https://paulikreisch.de/shop';
const doc = {kind:'other',mode:'custom',name:'Legacy preview regression',slug:'navigation-test',title:'Navigation test',code:{
  html:'<main><a class="outbound" target="_blank" href="'+target+'"><span>Zum Buch</span></a><a href="#details">Details</a><button id="interaction">Lichter an</button><p id="details">Details zum Buch</p><dialog id="destination">Legacy preview only</dialog></main>',
  css:'body{background:#153f40;color:#fff7e8;padding:24px}a,button{display:block;margin:16px;color:inherit}button{background:#7d1a1f;padding:12px}',
  js:'document.querySelector("a[href^=\\\"#\\\"]").addEventListener("click",e=>{e.preventDefault();document.querySelector("#details").scrollIntoView()});document.querySelector(".outbound").addEventListener("click",e=>{if(self!==top){e.preventDefault();document.querySelector("dialog").showModal()}});document.querySelector("#interaction").addEventListener("click",e=>e.currentTarget.textContent="Lichter aus");document.body.dataset.ready="yes";'
}};
const snapshots=process.argv[2]?JSON.parse(await fs.readFile(process.argv[2],'utf8')).map(r=>r.published.document):[];
let checked=0;
try {
for (const width of [320,375,414,768,1440]) {
  for (const preview of [false,true]) {
    console.log('Testing',width,preview?'preview':'live');
    const context=await browser.newContext({viewport:{width,height:900}});
    const page=await context.newPage();
    page.on('pageerror',error=>console.error('Page script error:',error.message));
    await page.route('**/*',async route=>{
      const request=route.request();
      if(request.url()===target)return route.fulfill({contentType:'text/html',body:'<h1>Book shop destination</h1>'});
      if(new URL(request.url()).hostname==='ads.paulikreisch.de') {
        let body=renderPage(doc,{preview});
        if(process.env.BASELINE) body=body.replace(/&lt;script&gt;\(function installLinkNavigation[\s\S]*?&lt;\/script&gt;/,'');
        return route.fulfill({headers:PUBLIC_HEADERS,body});
      }
      return route.abort();
    });
    await page.goto('https://ads.paulikreisch.de/navigation-test');
    const frame=page.frameLocator('iframe');
    await frame.locator('body[data-ready="yes"]').waitFor();
    await frame.locator('#interaction').click();
    await frame.getByRole('button',{name:'Lichter aus',exact:true}).waitFor();
    await frame.getByRole('link',{name:'Details',exact:true}).click();
    await frame.getByRole('link',{name:'Zum Buch',exact:true}).click();
    if(preview){
      await frame.getByRole('dialog',{name:'Linkziel in der privaten Vorschau'}).waitFor({timeout:3000});
      assert.equal(await frame.locator('[data-preview-destination]').textContent(),target);
      assert.equal(page.url(),'https://ads.paulikreisch.de/navigation-test');
      await page.screenshot({path:`/downloads/custom-preview-link-${width}.png`,fullPage:false});
      await frame.getByRole('button',{name:'Zurück zur Vorschau'}).click();
      assert.equal(await frame.locator('dialog[open]').count(),0);
    }else{
      await page.waitForURL(target,{timeout:3000});
      await page.getByRole('heading',{name:'Book shop destination'}).waitFor();
    }
    checked++;await context.close();
  }
}
// Re-run captured PUBLISHED documents, never their private drafts. Targets are
// fulfilled locally so this test neither opens a shop nor submits any request.
for(const snapshot of snapshots){
  if(snapshot.mode!=='custom')continue;
  const context=await browser.newContext({viewport:{width:390,height:844}});
  const page=await context.newPage();const origin=snapshot.kind==='lp'?'lp':'ads';
  const source=`https://${origin}.paulikreisch.de/${snapshot.slug}`;
  let destination;
  await page.route('**/*',async route=>{
    if(route.request().url()===source)return route.fulfill({headers:PUBLIC_HEADERS,body:renderPage(snapshot)});
    if(route.request().isNavigationRequest()&&route.request().frame()===page.mainFrame()) {destination=route.request().url();return route.fulfill({contentType:'text/html',body:'<h1>Verified destination</h1>'});}
    if(new URL(route.request().url()).hostname==='static.paulikreisch.de')return route.continue();
    return route.abort();
  });
  await page.goto(source);
  const frame=page.frameLocator('iframe');
  const link=frame.locator('a[href^="https:"]').filter({visible:true}).first();
  await link.waitFor();const expected=await link.getAttribute('href');
  await link.click();await page.getByRole('heading',{name:'Verified destination'}).waitFor({timeout:3000});
  assert.equal(destination,expected);checked++;await context.close();
}
// Long-page previews must scroll the parent to show the entire destination modal.
{
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 const longDoc=structuredClone(doc);
 longDoc.code.html='<div style="height:2500px">Long campaign</div>'+longDoc.code.html;
 await page.route('**/*',route=>route.fulfill({headers:PUBLIC_HEADERS,body:renderPage(longDoc,{preview:true})}));
 await page.goto('https://ads.paulikreisch.de/long-preview');
 const frame=page.frameLocator('iframe');
 await frame.locator('body[data-ready="yes"]').waitFor();
 await frame.getByRole('link',{name:'Zum Buch',exact:true}).click();
 const modal=frame.getByRole('dialog',{name:'Linkziel in der privaten Vorschau'});
 await modal.waitFor();
 await page.waitForTimeout(700);
 const bounds=await modal.boundingBox();
 assert.ok(bounds.y>=-1 && bounds.y+bounds.height<=844,JSON.stringify(bounds));
 await page.screenshot({path:'/downloads/custom-long-preview-link-390.png'});
 checked++;await context.close();
}
console.log(`${checked} browser regressions passed: live top navigation, preview-only destination dialog, hash navigation, ordinary controls, all captured published custom pages.`);
} finally {await browser.close();}

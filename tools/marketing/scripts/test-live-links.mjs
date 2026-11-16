import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',args:['--no-sandbox']});
const live={kind:'lp',name:'Published campaign',slug:'published-slug',campaign:'published-campaign',mode:'structured',steps:[{slug:'start',title:'Test',body:'Test',bullets:[]}]};
const draft={...live,name:'Draft name',slug:'draft-slug',campaign:'draft-campaign'};
let writes=0, withdrawn=false;
for(const width of [320,375,390,414,768,1440]){
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.addInitScript(()=>{window.copied=[];Object.defineProperty(navigator,'clipboard',{value:{writeText:async t=>window.copied.push(t)}});});
 await page.route('**/*',async route=>{
  const p=new URL(route.request().url()).pathname;
  if(p.startsWith('/api/marketing')){
   if(route.request().method()!=='GET')writes++;
   let data={};
   if(p.endsWith('/session'))data={csrf:'qa',role:'manager'};
   else if(p.endsWith('/documents'))data=[{id:'live',...draft,published:true,unpublishedChanges:true},{id:'private',...draft,published:false},{id:'newsletter',...draft,kind:'newsletter',published:false}];
   else if(p.endsWith('/documents/live'))data={id:'live',draft,revision:7,published:withdrawn?null:{document:live,revision:2}};
   else if(p.endsWith('/files/deletions'))data={pending:[]};
   else if(p.endsWith('/files'))data={records:[{id:'qa',name:'Published summer asset.webp',type:'image/webp',size:180000,status:'published',publicUrl:'https://static.paulikreisch.de/f/qa',revision:'2'}]};
   else if(p.endsWith('/links'))data={records:[]};
   return route.fulfill({json:data});
  }
  if(p==='/f/qa')return route.fulfill({status:200,contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="72" height="48"><rect width="72" height="48" fill="#315642"/></svg>'});
  const file=p==='/'?'studio.html':p.replace('/assets/','');
  try{await route.fulfill({body:await fs.readFile(new URL('../public/'+file,import.meta.url)),contentType:file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html'});}catch{await route.abort();}
 });
 await page.goto('https://m.paulikreisch.de/');
 await page.getByRole('button',{name:'Live-URL kopieren',exact:true}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Live-URL kopieren',exact:true}).count(),1);
 await page.getByRole('button',{name:'Live-URL kopieren',exact:true}).click();
 await page.waitForFunction(()=>window.copied.length===1);
 assert.equal(await page.evaluate(()=>window.copied[0]),'https://lp.paulikreisch.de/published-slug');
 await page.screenshot({path:`/downloads/studio-live-links-${width}.png`,fullPage:true});
 await page.getByRole('button',{name:'Tracking-Kurzlink erstellen',exact:true}).click();
 await page.locator('#links').waitFor({state:'visible'});
 assert.equal(await page.locator('#link-form [name=target]').inputValue(),'https://lp.paulikreisch.de/published-slug');
 assert.equal(await page.locator('#link-form [name=campaign]').inputValue(),'published-campaign');
 assert.equal(await page.locator('#link-form [name=label]').inputValue(),'Published campaign');
 await page.screenshot({path:`/downloads/studio-shortlink-prefill-${width}.png`,fullPage:true});
 await page.locator('[data-section=files]').click();await page.locator('#file-list article').waitFor();
 await page.screenshot({path:`/downloads/studio-files-${width}.png`,fullPage:true});
 await page.locator('[data-filter=all]').click();
 await page.locator('#documents article').first().getByRole('button',{name:'Bearbeiten',exact:true}).click();
 await page.locator('#live-actions button').first().waitFor();assert.equal(await page.locator('#live-actions button').count(),2);
 // A local unsaved field change must not send any API mutation.
 await page.locator('#editor [name=name]').fill('Unsaved local name');
 await page.getByRole('button',{name:'Live-URL kopieren',exact:true}).click();
 assert.equal(writes,0);
 withdrawn=true;
 await page.getByRole('button',{name:'Live-URL kopieren',exact:true}).click();
 await page.getByRole('status').filter({hasText:'Keine öffentliche Web-Ansicht verfügbar.'}).waitFor();
 assert.equal(await page.evaluate(()=>window.copied.length),2);
 withdrawn=false;
 live.kind='other';live.slug='published-ad';
 await page.getByRole('button',{name:'Live-URL kopieren',exact:true}).click();
 await page.waitForFunction(()=>window.copied.length===3);
 assert.equal(await page.evaluate(()=>window.copied[2]),'https://ads.paulikreisch.de/published-ad');
 live.kind='lp';live.slug='published-slug';await page.close();
}
assert.equal(writes,0);await browser.close();console.log('Live snapshot URL/prefill, editor, withdrawal guard, private/newsletter exclusion, zero writes; desktop/mobile screenshots passed.');

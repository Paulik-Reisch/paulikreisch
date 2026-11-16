import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const pub=new URL('./public/',import.meta.url).pathname;
const pixel='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const files={records:[
 {id:'123e4567-e89b-42d3-a456-426614174000',name:'sommer-ad-ring.png',size:244112,type:'image/png',status:'published',revision:'7',publicUrl:pixel},
 {id:'223e4567-e89b-42d3-a456-426614174000',name:'hero-inline-800-q40.webp',size:36788,type:'image/webp',status:'private',revision:'3'},
]};
const links={records:[
 {code:'Ab12',label:'Sommer Newsletter 1',target:'https://paulikreisch.de/shop',active:true,clicks:128,createdAt:'2026-11-16T10:00:00.000Z',campaign:'sommer-hallo-welt',revision:'9',url:'https://l.paulikreisch.de/Ab12'},
 {code:'x7z9',label:'LP Kampagne',target:'https://lp.paulikreisch.de/sommerpause-hallo-welt',active:false,clicks:42,createdAt:'2026-11-16T11:00:00.000Z',campaign:'sommer-hallo-welt',revision:'2',url:'https://l.paulikreisch.de/x7z9'},
 {code:'Buch-start',label:'Leseprobe',target:'https://paulikreisch.de/leseprobe',active:true,clicks:5,createdAt:'2026-11-16T12:00:00.000Z',revision:'1',url:'https://l.paulikreisch.de/Buch-start'},
]};
const json=v=>({status:200,contentType:'application/json',body:JSON.stringify(v)});
const browser=await chromium.launch();
async function shoot(width,name,section){
  const page=await (await browser.newContext({viewport:{width,height:900}})).newPage();
  await page.route('**/*',async route=>{
    const u=new URL(route.request().url());
    if(u.pathname.startsWith('/api/marketing/session'))return route.fulfill(json({csrf:'x',role:'manager'}));
    if(u.pathname.startsWith('/api/marketing/documents'))return route.fulfill(json([]));
    if(u.pathname.startsWith('/api/marketing/files/deletions'))return route.fulfill(json({pending:[],failedIds:[],incomplete:false}));
    if(u.pathname.startsWith('/api/marketing/files'))return route.fulfill(json(files));
    if(u.pathname.startsWith('/api/marketing/links'))return route.fulfill(json(links));
    const map={'/':'studio.html','/assets/studio.css':'studio.css','/assets/studio.js':'studio.js','/assets/code-editors.css':'bundled/code-editors.css','/assets/code-editors.js':'bundled/code-editors.js'};
    const f=map[u.pathname];if(!f)return route.fulfill({status:404,body:'nf'});
    const body=await fs.readFile(pub+f);const type=f.endsWith('.css')?'text/css':f.endsWith('.js')?'text/javascript':'text/html';
    return route.fulfill({status:200,contentType:type,body});
  });
  await page.goto('http://m.test/');await page.waitForTimeout(600);
  if(section)await page.click(`[data-section="${section}"]`);await page.waitForTimeout(400);
  await page.screenshot({path:`/tmp/qa-${name}.png`,fullPage:true});await page.close();
}
await shoot(1280,'files-wide','files');await shoot(1280,'links-wide','links');
await shoot(390,'files-mob','files');await shoot(390,'links-mob','links');
await shoot(1280,'overview',null);
await browser.close();console.log('done');

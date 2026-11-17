import {test,expect,type Page,type Route} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(process.cwd());
const phrase='EINMALIGEN VERSANDTEST AN PHILIPP SENDEN';
const probe={enabled:true,configured:true,digest:'fixture-digest',phrase,to:'philipp.l.paulik@gmail.com',from:'Paulik & Reisch <newsletter@news.paulikreisch.de>',replyTo:'philipp.l.paulik@gmail.com',subject:'Paulik & Reisch: Versandtest',text:'Fixture only. No email is sent.',warning:'Exactly one fixture.'};
async function studio(page:Page,{enabled=true,fail=false}={}){
 const posts:unknown[]=[];
 await page.route('**/*',async(route:Route)=>{
  const u=new URL(route.request().url()),p=u.pathname;
  if(p==='/assets/studio.js'||p==='/assets/studio.css')return route.fulfill({path:path.join(root,'tools/marketing/public',p.split('/').pop()!),contentType:p.endsWith('.js')?'text/javascript':'text/css'});
  if(p==='/')return route.fulfill({body:await fs.readFile(path.join(root,'tools/marketing/public/studio.html'),'utf8'),contentType:'text/html'});
  if(p==='/api/marketing/session')return route.fulfill({json:{csrf:'fixture',role:'manager'}});
  if(p==='/api/marketing/documents')return route.fulfill({json:[]});
  if(p==='/api/marketing/newsletter/transport-test'){
   if(route.request().method()==='POST'){posts.push(route.request().postDataJSON());return route.fulfill({status:fail?503:200,json:fail?{error:'Fixture timeout'}:{accepted:true,providerId:'fixture'}});}
   return route.fulfill({json:{...probe,enabled}});
  }
  return route.fulfill({status:404,body:''});
 });
 await page.goto('http://studio.fixture/');
 await page.waitForFunction(()=>document.querySelector('#workspace')?.getAttribute('hidden')===null);
 // Render the real preflight without a document mutation or provider connection.
 await page.evaluate(()=>{(window as any).showNewsletterPreflight({revision:5,ready:false,enabled:false,count:0,dailyLimit:100,blockers:['No recipients'],warnings:[],browserUrl:'https://example.invalid/private'});document.querySelector('#editor')?.removeAttribute('hidden');});
 return posts;
}
test('native probe prompt is replaced by exact inline confirmation, with one POST only',async({page})=>{
 const posts=await studio(page);page.on('dialog',()=>{throw Error('Native dialog must not open');});
 await page.getByRole('button',{name:'Technischen Einzeltest prüfen'}).click();
 const send=page.getByRole('button',{name:'Einzelne Testmail senden'}),input=page.getByRole('textbox',{name:'Zum einmaligen Senden exakt eintippen:'});
 await expect(send).toBeDisabled();await input.fill('wrong');await expect(send).toBeDisabled();expect(posts).toHaveLength(0);
 await input.fill(phrase);await expect(send).toBeEnabled();await send.dblclick();
 await expect(page.locator('#status')).toContainText('vom Anbieter angenommen');expect(posts).toEqual([{digest:'fixture-digest',phrase}]);await expect(page.getByRole('button',{name:'Technischen Einzeltest prüfen'})).toBeDisabled();
});
test('cancel never submits',async({page})=>{
 const posts=await studio(page);await page.getByRole('button',{name:'Technischen Einzeltest prüfen'}).click();await page.getByRole('button',{name:'Abbrechen',exact:true}).click();expect(posts).toHaveLength(0);await expect(page.locator('.action-confirmation')).toHaveCount(0);
});
test('disabled runtime reports a blocked test without a native alert',async({page})=>{
 const posts=await studio(page,{enabled:false});page.on('dialog',()=>{throw Error('No native alert');});await page.getByRole('button',{name:'Technischen Einzeltest prüfen'}).click();await expect(page.locator('#status')).toContainText('Test ist gesperrt');expect(posts).toHaveLength(0);
});
test('uncertain provider result cannot be repeated in the same panel',async({page})=>{
 const posts=await studio(page,{fail:true});await page.getByRole('button',{name:'Technischen Einzeltest prüfen'}).click();await page.getByRole('textbox',{name:'Zum einmaligen Senden exakt eintippen:'}).fill(phrase);await page.getByRole('button',{name:'Einzelne Testmail senden'}).click();await expect(page.locator('#status')).toContainText('nicht erneut senden');await expect(page.getByRole('button',{name:'Technischen Einzeltest prüfen'})).toBeDisabled();expect(posts).toHaveLength(1);
});
test('inline confirmation stays readable at studio viewport widths',async({page},testInfo)=>{
 await studio(page);await page.getByRole('button',{name:'Technischen Einzeltest prüfen'}).click();
 for(const width of [320,375,414,768,1440]){await page.setViewportSize({width,height:1000});await page.locator('.action-confirmation').scrollIntoViewIfNeeded();await expect(page.getByRole('button',{name:'Einzelne Testmail senden'})).toBeVisible();await page.screenshot({path:testInfo.outputPath(`probe-inline-${width}.png`)});}
});

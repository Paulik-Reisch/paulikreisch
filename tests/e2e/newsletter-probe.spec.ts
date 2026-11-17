import {test,expect,type Page,type Route} from '@playwright/test';
import {assets} from '../../src/marketing/generated-assets.mjs';
const phrase='EINMALIGEN VERSANDTEST AN PHILIPP SENDEN';
const probe={enabled:true,configured:true,digest:'fixture-digest',phrase,to:'philipp.l.paulik@gmail.com',from:'Paulik & Reisch <newsletter@news.paulikreisch.de>',replyTo:'philipp.l.paulik@gmail.com',subject:'Paulik & Reisch: Versandtest',text:'Fixture only. No email is sent.',warning:'Exactly one fixture.'};
async function studio(page:Page,{enabled=true,fail=false,campaignReady=false}={}){
 const posts:unknown[]=[];
 await page.route('**/*',async(route:Route)=>{
  const u=new URL(route.request().url()),p=u.pathname;
  if(p==='/assets/studio.js'||p==='/assets/studio.css')return route.fulfill({body:assets[p].body,contentType:assets[p].type});
  if(p==='/')return route.fulfill({body:assets['/'].body,contentType:'text/html'});
  if(p==='/api/marketing/session')return route.fulfill({json:{csrf:'fixture',role:'manager'}});
  if(p==='/api/marketing/documents')return route.fulfill({json:[]});
  if(p==='/api/marketing/documents/campaign-fixture/send-preview')return route.fulfill({json:{revision:5,ready:campaignReady,enabled:campaignReady,count:campaignReady?1:0,dailyLimit:100,blockers:campaignReady?[]:['No recipients'],warnings:[],browserUrl:'https://example.invalid/private',subject:'Fixture campaign',from:'Fixture <fixture@example.invalid>',digest:'campaign-fixture-digest',phrase:'SENDEN 1'}});
  if(p==='/api/marketing/documents/campaign-fixture/send'){posts.push(route.request().postDataJSON());return route.fulfill({status:fail?503:200,json:fail?{error:'Fixture uncertain result'}:{sent:1,failed:0,notAttempted:0}});}
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

async function campaign(page:Page){
 await page.evaluate(()=>{(window as any).edit({id:'campaign-fixture',revision:5,draft:{kind:'newsletter',mode:'structured',name:'Fixture',slug:'fixture',subject:'Fixture campaign'}});});
}
test('campaign confirmation uses exact inline phrase and submits once despite double clicks',async({page})=>{
 const posts=await studio(page,{campaignReady:true});await campaign(page);page.on('dialog',()=>{throw Error('No native campaign dialog');});
 await page.getByRole('button',{name:'Versand prüfen',exact:true}).dblclick();
 const send=page.getByRole('button',{name:'Newsletter senden',exact:true}),input=page.getByRole('textbox',{name:'Zum einmaligen Senden exakt eintippen: SENDEN 1',exact:true});
 await expect(send).toBeDisabled();await input.fill('SENDEN 2');await expect(send).toBeDisabled();expect(posts).toHaveLength(0);
 await input.fill('SENDEN 1');await send.click();await expect(page.locator('#status')).toContainText('Gesendet: 1');expect(posts).toEqual([{digest:'campaign-fixture-digest',phrase:'SENDEN 1'}]);
 await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();await expect(page.locator('#status')).toContainText('bereits versucht');await expect(send).toHaveCount(0);expect(posts).toHaveLength(1);
});
test('campaign cancellation cannot submit',async({page})=>{
 const posts=await studio(page,{campaignReady:true});await campaign(page);await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();await page.getByRole('button',{name:'Abbrechen',exact:true}).click();expect(posts).toHaveLength(0);
});
test('campaign without confirmed recipients stays in private preview',async({page})=>{
 const posts=await studio(page);await campaign(page);await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();await expect(page.locator('#status')).toContainText('Nichts wurde versendet');await expect(page.getByRole('button',{name:'Newsletter senden',exact:true})).toHaveCount(0);expect(posts).toHaveLength(0);
});
test('uncertain campaign result is not resubmitted on a new preview in the same session',async({page})=>{
 const posts=await studio(page,{campaignReady:true,fail:true});await campaign(page);await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();await page.getByRole('textbox',{name:'Zum einmaligen Senden exakt eintippen: SENDEN 1',exact:true}).fill('SENDEN 1');await page.getByRole('button',{name:'Newsletter senden',exact:true}).click();await expect(page.locator('#status')).toContainText('nicht erneut senden');await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();await expect(page.locator('#status')).toContainText('bereits versucht');expect(posts).toHaveLength(1);
});

test('campaign inline review stays readable at five viewport widths',async({page},testInfo)=>{
 await studio(page,{campaignReady:true});await campaign(page);await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();
 for(const width of [320,375,414,768,1440]){await page.setViewportSize({width,height:1000});await page.locator('.action-confirmation').scrollIntoViewIfNeeded();await expect(page.getByRole('button',{name:'Newsletter senden',exact:true})).toBeVisible();expect(await page.locator('.editor-actions .action-confirmation').count()).toBe(0);expect(await page.getByRole('button',{name:'Entwurf speichern',exact:true}).evaluate(el=>el.getBoundingClientRect().height)).toBeLessThan(60);await page.screenshot({path:testInfo.outputPath(`campaign-inline-${width}.png`)});}
});


test('navigation cancels the campaign confirmation without a POST',async({page})=>{
 const posts=await studio(page,{campaignReady:true});await campaign(page);await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();await expect(page.locator('.action-confirmation')).toHaveCount(1);
 await page.locator('#back').click();await expect(page.locator('.action-confirmation')).toHaveCount(0);expect(posts).toHaveLength(0);
});

test('leaving during a pending campaign preflight does not create a stale confirmation',async({page})=>{
 const posts=await studio(page,{campaignReady:true});await campaign(page);
 let release!:()=>void;const wait=new Promise<void>(resolve=>{release=resolve;});let entered!:()=>void;const pending=new Promise<void>(resolve=>{entered=resolve;});
 await page.route('**/api/marketing/documents/campaign-fixture/send-preview',async route=>{entered();await wait;await route.fulfill({json:{revision:5,ready:true,enabled:true,count:1,dailyLimit:100,blockers:[],warnings:[],browserUrl:'https://example.invalid/private',subject:'Fixture campaign',from:'Fixture <fixture@example.invalid>',digest:'campaign-fixture-digest',phrase:'SENDEN 1'}});});
 await page.getByRole('button',{name:'Versand prüfen',exact:true}).click();await pending;await page.locator('#back').click();release();
 await expect(page.locator('#send-check')).toBeEnabled();await expect(page.locator('.action-confirmation')).toHaveCount(0);expect(posts).toHaveLength(0);
});

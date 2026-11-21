import { test, expect } from '@playwright/test';
import { getWorthaftDateString, getWorthaftMillisecondsUntilNextDay } from '../../src/lib/worthaft-daily-word';
const today = getWorthaftDateString();
test.beforeEach(async ({page}) => {
  await page.route(/identitytoolkit|firestore.googleapis.com|securetoken/, r=>r.abort());
  await page.addInitScript(()=>{
    localStorage.setItem('hallowelt_cookie_consent',JSON.stringify({necessary:true,analytics:false,marketing:false}));
    localStorage.setItem('theme','light');
  });
});
for (const key of ['worthaft-stats','worthaft-daily-game']) {
  test(`recovers from corrupt ${key} without erasing unrelated or original values`, async ({page})=>{
    const raw = key==='worthaft-stats'?'not-json':JSON.stringify({date:today,guesses:null,status:'playing'});
    await page.addInitScript(({key,raw})=>{localStorage.setItem(key,raw);localStorage.setItem('unrelated','keep');}, {key,raw});
    await page.goto('/worthaft');
    await expect(page.getByTestId('worthaft-grid')).toBeVisible();
    await page.keyboard.type('ap');
    await expect(page.getByTestId('worthaft-grid')).toContainText('A');
    expect(await page.evaluate(key=>localStorage.getItem(key),key)).toBe(raw);
    expect(await page.evaluate(()=>localStorage.getItem('unrelated'))).toBe('keep');
    await page.reload(); await expect(page.getByTestId('worthaft-grid')).toBeVisible();
  });
}
test('valid saved progress and statistics survive reload', async ({page})=>{
  const saved={date:today,guesses:[{guess:'APFEL',statuses:['absent','present','correct','absent','present']}],status:'playing',letterStatuses:{A:'absent'},rowTimes:[1234]};
  await page.addInitScript(({saved})=>{localStorage.setItem('worthaft-daily-game',JSON.stringify(saved));localStorage.setItem('worthaft-stats',JSON.stringify({games:9,wins:8,streak:2,maxStreak:4}));},{saved});
  await page.goto('/worthaft');await expect(page.getByTestId('worthaft-grid')).toContainText('APFEL');
  await page.reload();await expect(page.getByTestId('worthaft-grid')).toContainText('APFEL');
  expect(JSON.parse((await page.evaluate(()=>localStorage.getItem('worthaft-stats')))!)).toEqual({games:9,wins:8,streak:2,maxStreak:4});
});
test('unavailable localStorage does not stop play',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}})});
 await page.goto('/worthaft');await expect(page.getByTestId('worthaft-grid')).toBeVisible();await page.keyboard.type('apfel');await page.keyboard.press('Enter');await expect(page.getByTestId('worthaft-grid')).toBeVisible();
});
for(const width of [390,1440])test(`mobile dialog traps and restores focus at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.goto('/');
 if(width===1440){await expect(page.getByRole('button',{name:'Menü öffnen'})).toBeHidden();return;}
 const trigger=page.getByRole('button',{name:'Menü öffnen'});await trigger.focus();await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog',{name:'Navigation'});await expect(dialog).toBeVisible();
 await expect(dialog.getByRole('button',{name:'Menü schließen'})).toBeFocused();
 for(let i=0;i<12;i++){await page.keyboard.press('Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);}
 for(let i=0;i<8;i++){await page.keyboard.press('Shift+Tab');expect(await dialog.evaluate(el=>el.contains(document.activeElement))).toBe(true);}
 await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(trigger).toBeFocused();
 await trigger.click();await page.setViewportSize({width:1440,height:900});await expect(dialog).toBeHidden();
});
test('Berlin midnight requests fresh server data instead of a 24 hour countdown', async({page})=>{
 const noon=new Date(`${today}T12:00:00Z`);
 const date=new Date(noon.getTime()+getWorthaftMillisecondsUntilNextDay(noon)-4000);
 await page.clock.install({time:date});
 await page.addInitScript(({today})=>{localStorage.setItem('worthaft-daily-game',JSON.stringify({date:today,status:'won',guesses:[{guess:'APFEL',statuses:Array(5).fill('correct')}],letterStatuses:{},rowTimes:[1000]}));localStorage.setItem(`worthaft-feedback-${today}`,'skipped');},{today});
 await page.goto('/worthaft');await expect(page.getByTestId('worthaft-grid')).toBeVisible();
 // Server clock is deliberately not changed. Count refresh attempts, then
 // verify they are bounded while the server still serves the prior date.
 let refreshes=0;await page.route('**/worthaft?*',route=>{if(route.request().headers().rsc==='1')refreshes++;return route.continue();});
 await page.clock.runFor(5500);await expect.poll(()=>refreshes).toBeGreaterThan(0);
 await expect(page.getByText('00:00:00',{exact:true})).toBeVisible();expect(refreshes).toBeLessThanOrEqual(1);
});

test('new server day remounts a clean board and closes yesterday results',async({page})=>{
 const dayAfter=new Date(`${today}T12:00:00Z`);dayAfter.setUTCDate(dayAfter.getUTCDate()+1);
 const next=dayAfter.toISOString().slice(0,10);
 const noon=new Date(`${today}T12:00:00Z`);
 await page.clock.install({time:new Date(noon.getTime()+getWorthaftMillisecondsUntilNextDay(noon)-4000)});
 await page.addInitScript(({today})=>{localStorage.setItem('worthaft-daily-game',JSON.stringify({date:today,status:'won',guesses:[{guess:'APFEL',statuses:Array(5).fill('correct')}],letterStatuses:{},rowTimes:[1000]}));localStorage.setItem(`worthaft-feedback-${today}`,'skipped');},{today});
 await page.goto('/worthaft');await expect(page.getByTestId('worthaft-grid')).toContainText('APFEL');
 await page.route('**/worthaft?*',async route=>{
   const response=await route.fetch();let body=await response.text();
   body=body.replaceAll(today,next).replace(/"dailyWord":"[A-ZÄÖÜẞ]{5}"/g,'"dailyWord":"BIRNE"');
   await route.fulfill({response,body});
 });
 await page.clock.runFor(5500);
 await expect(page.getByTestId('worthaft-grid')).not.toContainText('APFEL');
 await expect(page.getByTestId('worthaft-grid')).toBeVisible();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 // The old saved day is not relabelled or deleted on the date switch.
 expect(JSON.parse((await page.evaluate(()=>localStorage.getItem('worthaft-daily-game')))! ).date).toBe(today);
 await page.keyboard.type('birne');await page.keyboard.press('Enter');
 await expect.poll(async()=>JSON.parse((await page.evaluate(()=>localStorage.getItem('worthaft-daily-game')))!)).toMatchObject({date:next,status:'won'});
});

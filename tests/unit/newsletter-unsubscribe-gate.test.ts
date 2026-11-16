import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
const read=(p:string)=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('unsubscribe routes use removal-only capability, not registration store',()=>{
 for(const name of ['confirm','one-click']){const s=read('src/app/nl/unsubscribe/'+name+'/route.ts');assert.match(s,/getNewsletterUnsubscriber/);assert.doesNotMatch(s,/getNewsletterSubscribers|createResend|sendCampaign/);}
});
test('removal capability is separately gated and exposes only unsubscribe',()=>{
 const s=read('src/newsletter/server.ts'),part=s.slice(s.indexOf('export function getNewsletterUnsubscriber'));
 assert.match(part,/NEWSLETTER_UNSUBSCRIBE_ENABLED !== '1'/);assert.match(part,/Object.freeze\(\{ unsubscribe:/);assert.doesNotMatch(part,/newsletterStoreEnabled\(|\.send\(|\.subscribe\(|\.confirm\(/);
 assert.ok(part.indexOf("NEWSLETTER_UNSUBSCRIBE_ENABLED !== '1'")<part.indexOf('buildNewsletterSubscribers()'));
});
test('old address-only links have explicit no-removal notice and never submit the address',()=>{
 const s=read('src/app/nl/unsubscribe/page.tsx');assert.match(s,/params.has\("email"\)/);assert.match(s,/Hier wurde noch keine Abmeldung vorgenommen/);assert.doesNotMatch(s,/params.get\("email"\)|JSON.stringify\(\{ email/);
});

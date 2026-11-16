import test from 'node:test';import assert from 'node:assert/strict';
import {tokenFor,tokenId,checkToken} from '../../src/newsletter/tokens.mjs';
import {NewsletterSubscribers,MemorySubscriberStore,normalizeEmail,CONFIRM_TTL_MS} from '../../src/newsletter/subscribers.mjs';
import {createResend} from '../../src/newsletter/resend.mjs';
import {sendCampaign,previewSend,personalize,buildMessage,SendRefused} from '../../src/newsletter/campaign.mjs';
const SECRET='x'.repeat(40),consent={source:'test',consentText:'Ich willige in den Newsletter ein.',consentVersion:'v1'};
const mk=()=>{let t=Date.parse('2026-11-16T12:00:00Z');const clock={advance:ms=>{t+=ms;}};const subs=new NewsletterSubscribers(new MemorySubscriberStore(),{secret:SECRET,now:()=>new Date(t).toISOString()});return {subs,clock};};
async function activate(subs,email){const r=await subs.subscribe(email,consent);assert.ok(r.confirmToken);assert.deepEqual(await subs.confirm(r.confirmToken),{ok:true});}
test('tokens are purpose-bound, opaque and tamper-proof',()=>{
  const id='123e4567-e89b-42d3-a456-426614174000',t=tokenFor(SECRET,'unsubscribe',id);
  assert.equal(tokenId(t),id);assert.ok(checkToken(SECRET,'unsubscribe',t,id));
  assert.equal(checkToken(SECRET,'confirm',t,id),false);
  assert.equal(checkToken(SECRET,'unsubscribe',t.slice(0,-1)+(t.endsWith('A')?'B':'A'),id),false);
  assert.equal(checkToken('y'.repeat(40),'unsubscribe',t,id),false);
  assert.equal(tokenId('a.b'),null);assert.equal(tokenId(null),null);assert.equal(tokenId(t+'.x'),null);
  assert.throws(()=>tokenFor('short','confirm',id));assert.ok(!t.includes('@'));
});
test('email normalization rejects junk',()=>{
  assert.equal(normalizeEmail(' A@Example.DE '),'a@example.de');
  for(const bad of ['', 'a@b','a b@c.de','a@@c.de','<x@y.de>','a..b@c.de',null,'x'.repeat(260)+'@c.de'])assert.equal(normalizeEmail(bad),null);
});
test('only double opt-in recipients are mailable; same outward answer for known addresses',async()=>{
  const {subs}=mk();
  const first=await subs.subscribe('a@example.de',consent);assert.ok(first.ok&&first.confirmToken);
  assert.deepEqual(await subs.mailable(),[]);
  const repeat=await subs.subscribe('a@example.de',consent);assert.ok(repeat.ok);assert.equal(repeat.confirmToken,null);
  assert.deepEqual(await subs.confirm(first.confirmToken),{ok:true});
  assert.deepEqual(await subs.confirm(first.confirmToken),{ok:false});
  const list=await subs.mailable();assert.equal(list.length,1);assert.equal(list[0].email,'a@example.de');
  const again=await subs.subscribe('a@example.de',consent);assert.equal(again.confirmToken,null);
});
test('consent evidence is required and confirmation expires',async()=>{
  const {subs,clock}=mk();
  await assert.rejects(()=>subs.subscribe('a@example.de',{source:'x'}));
  const r=await subs.subscribe('a@example.de',consent);clock.advance(CONFIRM_TTL_MS+1);
  assert.deepEqual(await subs.confirm(r.confirmToken),{ok:false,expired:true});assert.deepEqual(await subs.mailable(),[]);
});
test('unsubscribe is idempotent, token-bound and removes from mailable',async()=>{
  const {subs}=mk();await activate(subs,'a@example.de');await activate(subs,'b@example.de');
  const [a,b]=await subs.mailable();
  assert.deepEqual(await subs.unsubscribe(a.unsubscribeToken),{ok:true});assert.deepEqual(await subs.unsubscribe(a.unsubscribeToken),{ok:true});
  assert.deepEqual(await subs.unsubscribe(a.unsubscribeToken.replace(a.id,b.id)),{ok:false});
  assert.deepEqual((await subs.mailable()).map(r=>r.email),['b@example.de']);
  assert.deepEqual(await subs.counts(),{pending:0,active:1,unsubscribed:1,suppressed:0});
});
test('unsubscribed users can only return through a fresh confirmation; suppressed never',async()=>{
  const {subs,clock}=mk();await activate(subs,'a@example.de');const [a]=await subs.mailable();
  await subs.unsubscribe(a.unsubscribeToken);clock.advance(11*60*1000);
  const again=await subs.subscribe('a@example.de',consent);assert.ok(again.confirmToken);assert.deepEqual(await subs.mailable(),[]);
  await subs.confirm(again.confirmToken);assert.equal((await subs.mailable()).length,1);
  await subs.suppress('a@example.de','complaint');assert.deepEqual(await subs.mailable(),[]);
  const blocked=await subs.subscribe('a@example.de',consent);assert.equal(blocked.confirmToken,null);assert.deepEqual(await subs.mailable(),[]);
  await subs.suppress('new@example.de','bounce');assert.equal((await subs.counts()).suppressed,2);
});
const content={html:'<p>Hi</p><a href="{{abmeldelink}}">x</a>',text:'Hi\nAbbestellen: {{abmeldelink}}'};
const recipients=[{id:'123e4567-e89b-42d3-a456-426614174000',email:'a@example.de',unsubscribeToken:'t1'},{id:'123e4567-e89b-42d3-a456-426614174001',email:'b@example.de',unsubscribeToken:'t2'}];
test('personalize requires the placeholder and refuses cid and unknown placeholders',()=>{
  assert.throws(()=>personalize({html:'<p>x</p>',text:'x {{abmeldelink}}'},'u'),SendRefused);
  assert.throws(()=>personalize({html:'{{abmeldelink}} {{vorname}}',text:'{{abmeldelink}}'},'u'),SendRefused);
  assert.throws(()=>personalize({html:'<img src="cid:a">{{abmeldelink}}',text:'{{abmeldelink}}'},'u'),SendRefused);
  const m=buildMessage({from:'A <a@news.example.invalid>',subject:'S',content,recipient:recipients[0],baseUrl:'https://paulikreisch.de/'});
  assert.match(m.headers['List-Unsubscribe'],/^<https:\/\/paulikreisch\.de\/nl\/unsubscribe\/one-click\?t=t1>$/);assert.equal(m.headers['List-Unsubscribe-Post'],'List-Unsubscribe=One-Click');
  assert.ok(m.text.includes('?t=t1')&&!m.html.includes('{{'));
});
function args(over={}){const calls=[];const resend={send:async(m,o)=>{calls.push([m,o]);return {id:'r'+calls.length};}};return {calls,args:{enabled:true,from:'A <a@news.example.invalid>',subject:'S',content,recipients,dailyLimit:100,resend,baseUrl:'https://paulikreisch.de',campaignId:'sommer-1',sleep:async()=>{},...over}};}
test('send guard: disabled, stale digest, wrong phrase, limit, empty',async()=>{
  const {calls,args:a}=args(),p=previewSend(a);
  await assert.rejects(()=>sendCampaign({...a,enabled:false,confirmation:p}),SendRefused);
  await assert.rejects(()=>sendCampaign({...a,confirmation:{digest:p.digest,phrase:'SENDEN 1'}}),SendRefused);
  await assert.rejects(()=>sendCampaign({...a,confirmation:{digest:'0'.repeat(64),phrase:p.phrase}}),SendRefused);
  await assert.rejects(()=>sendCampaign({...a,subject:'Anders',confirmation:p}),SendRefused);
  await assert.rejects(()=>sendCampaign({...a,recipients:[],confirmation:p}),SendRefused);
  await assert.rejects(()=>sendCampaign({...a,dailyLimit:1,confirmation:p}),SendRefused);
  assert.equal(calls.length,0);
});
test('send: one message per recipient, idempotency keys, stops on auth/rate errors',async()=>{
  const {calls,args:a}=args(),p=previewSend(a);
  const r=await sendCampaign({...a,confirmation:{digest:p.digest,phrase:p.phrase}});
  assert.equal(r.sent,2);assert.equal(calls.length,2);assert.ok(calls.every(([m])=>m.to.length===1));
  assert.deepEqual(calls.map(([,o])=>o.idempotencyKey),[`sommer-1:${recipients[0].id}`,`sommer-1:${recipients[1].id}`]);
  const failing={send:async()=>{throw Object.assign(new Error('x'),{status:429});}};
  const r2=await sendCampaign({...a,resend:failing,confirmation:{digest:p.digest,phrase:p.phrase}});
  assert.deepEqual([r2.sent,r2.failed,r2.notAttempted],[0,1,1]);
});
test('resend client sends bearer auth and idempotency header, never leaks the key in errors',async()=>{
  let seen;const f=async(url,init)=>{seen={url,init};return new Response(JSON.stringify({id:'abc'}),{status:200});};
  const c=createResend({apiKey:'re_secretsecret',fetcher:f});
  assert.deepEqual(await c.send({from:'a',to:['b@example.de'],subject:'s',html:'h',text:'t',headers:{'List-Unsubscribe':'<u>'}},{idempotencyKey:'k'}),{id:'abc'});
  assert.equal(seen.url,'https://api.resend.com/emails');assert.equal(seen.init.headers['idempotency-key'],'k');assert.equal(seen.init.headers.authorization,'Bearer re_secretsecret');
  const bad=createResend({apiKey:'re_secretsecret',fetcher:async()=>new Response(JSON.stringify({message:'nope'}),{status:403})});
  await assert.rejects(()=>bad.send({from:'a',to:['b@example.de'],subject:'s',html:'h',text:'t'}),e=>e.status===403&&!e.message.includes('re_secret'));
  await assert.rejects(()=>c.send({from:'a',to:['a@x.de','b@x.de'],subject:'s'}));
});

import {FirestoreSubscriberStore} from '../../src/newsletter/firestore-store.mjs';
import {recipientId} from '../../src/newsletter/subscribers.mjs';
test('firestore store: one document per recipient, update is transactional',async()=>{
  const docs=new Map();
  const ref=id=>({id,get:async()=>({exists:docs.has(id),data:()=>docs.get(id)})});
  const db={collection:()=>({doc:ref,get:async()=>({docs:[...docs.values()].map(v=>({data:()=>v}))})}),runTransaction:async fn=>fn({get:r=>r.get(),set:(r,d)=>{docs.set(r.id,structuredClone(d));}})};
  const s=new FirestoreSubscriberStore(db);
  assert.deepEqual(await s.list(),[]);
  assert.equal(await s.update('a',old=>({value:old,record:{id:'a'}})),null);
  assert.equal(await s.update('a',old=>({value:old.id})),'a');
  assert.equal(docs.size,1);
  await s.update('b',()=>({value:1,record:{id:'b'}}));
  assert.equal((await s.list()).length,2);
});
test('record id is a keyed UUID-shaped hash of the address, not the address',()=>{
  const a=recipientId(SECRET,'a@b.de');
  assert.match(a,/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
  assert.equal(a,recipientId(SECRET,'a@b.de'));
  assert.notEqual(a,recipientId(SECRET,'c@d.de'));
  assert.notEqual(a,recipientId('y'.repeat(40),'a@b.de'));
});

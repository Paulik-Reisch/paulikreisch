import test from 'node:test';import assert from 'node:assert/strict';
import {tokenFor,tokenId,checkToken} from '../../src/newsletter/tokens.mjs';
import {NewsletterSubscribers,MemorySubscriberStore,normalizeEmail,CONFIRM_TTL_MS} from '../../src/newsletter/subscribers.mjs';
import {createResend} from '../../src/newsletter/resend.mjs';
import {sendCampaign,previewSend,personalize,buildMessage,SendRefused} from '../../src/newsletter/campaign.mjs';
const SECRET='x'.repeat(40),consent={source:'test',consentText:'Ich willige in den Newsletter ein.',consentVersion:'v1'};
const mk=()=>{let t=Date.parse('2026-11-16T12:00:00Z');const clock={advance:ms=>{t+=ms;}};const subs=new NewsletterSubscribers(new MemorySubscriberStore(),{secret:SECRET,now:()=>new Date(t).toISOString()});return {subs,clock};};
async function activate(subs,email){const r=await subs.subscribe(email,consent);assert.ok(r.confirmToken);assert.equal((await subs.confirm(r.confirmToken)).ok,true);}
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
  assert.equal((await subs.confirm(first.confirmToken)).ok,true);
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

import {createHmac as _h} from 'node:crypto';
import {verifyWebhook,suppressionsFor,handleWebhook,WebhookRefused} from '../../src/newsletter/webhook.mjs';
test('webhook: svix documented example vector verifies, tampering and stale timestamps are refused',()=>{
  const secret='whsec_plJ3nmyCDGBKInavdOK15jsl',rawBody='{"event_type":"ping","data":{"success":true}}';
  const headers={'svix-id':'msg_loFOjxBNrRLzqYUf','svix-timestamp':'1731705121','svix-signature':'v1,rAvfW3dJ/X/qxhsaXPOyyCGmRKsaKWcsNccKXlIktD0='};
  const nowMs=1731705121*1000+1000;
  assert.equal(verifyWebhook({secret,rawBody,headers,nowMs}).event_type,'ping');
  assert.throws(()=>verifyWebhook({secret,rawBody:rawBody+' ',headers,nowMs}),WebhookRefused);
  assert.throws(()=>verifyWebhook({secret,rawBody,headers,nowMs:nowMs+3600e3}),WebhookRefused);
  assert.throws(()=>verifyWebhook({secret:'whsec_AAAA',rawBody,headers,nowMs}),WebhookRefused);
  assert.equal(verifyWebhook({secret,rawBody,headers:{...headers,'svix-signature':'v1,AAAA '+headers['svix-signature']},nowMs}).event_type,'ping');
});
test('webhook: only permanent bounces, complaints and provider suppressions suppress; idempotent',async()=>{
  assert.deepEqual(suppressionsFor({type:'email.bounced',data:{to:['a@b.de'],bounce:{type:'Permanent'}}}),[{email:'a@b.de',reason:'bounce'}]);
  assert.deepEqual(suppressionsFor({type:'email.bounced',data:{to:['a@b.de'],bounce:{type:'Temporary'}}}),[]);
  assert.deepEqual(suppressionsFor({type:'email.delivered',data:{to:['a@b.de']}}),[]);
  const secret='whsec_'+Buffer.from('k'.repeat(24)).toString('base64'),{subs}=mk();
  await subs.subscribe('a@b.de',consent);
  const rawBody=JSON.stringify({type:'email.complained',data:{to:['a@b.de']}}),id='msg_1',ts=String(Math.floor(Date.now()/1000));
  const signature='v1,'+_h('sha256',Buffer.from(secret.slice(6),'base64')).update(`${id}.${ts}.${rawBody}`).digest('base64');
  const headers={'svix-id':id,'svix-timestamp':ts,'svix-signature':signature};
  assert.equal((await handleWebhook({subscribers:subs,secret,rawBody,headers})).handled,1);
  assert.equal((await handleWebhook({subscribers:subs,secret,rawBody,headers})).handled,1);
  assert.equal((await subs.counts()).suppressed,1);
});
test('rotation: old tokens still verify, record ids survive a token secret change',async()=>{
  const store=new MemorySubscriberStore(),A='a'.repeat(40),B='b'.repeat(40);
  const one=new NewsletterSubscribers(store,{secret:A,idKey:'i'.repeat(40)});
  const r=await one.subscribe('x@y.de',consent);await one.confirm(r.confirmToken);
  const [m]=await one.mailable();
  const two=new NewsletterSubscribers(store,{secret:B,previousSecrets:[A],idKey:'i'.repeat(40)});
  assert.equal((await two.unsubscribe(m.unsubscribeToken)).ok,true);
  assert.equal((await two.suppress('x@y.de','bounce')).ok,true);
  assert.equal((await two.counts()).suppressed,1);assert.equal((await two.counts()).unsubscribed,0);
  const three=new NewsletterSubscribers(store,{secret:B,idKey:'i'.repeat(40)});
  assert.equal((await three.unsubscribe(m.unsubscribeToken)).ok,false);
});

import {createNewsletterSender} from '../../src/newsletter/studio-api.mjs';
test('studio sender: preview is read-only, send needs digest and phrase and the enabled flag',async()=>{
  const draft={kind:'newsletter',slug:'sommer',mode:'custom',subject:'S',code:{html:'<p>x {{abmeldelink}}</p>',text:'x {{abmeldelink}}'}};const rec={id:'abc',draft,published:null,revision:3};
  const sent=[];
  const make=enabled=>createNewsletterSender({getStatus:()=>({webhookConfigured:true}),getSubscribers:()=>({mailable:async()=>[{id:'a',email:'a@example.invalid',unsubscribeToken:'t.t'}]}),getResend:()=>({send:async m=>{sent.push(m);return {id:'p1'};}}),from:'N <n@news.example.invalid>',baseUrl:'https://example.invalid',dailyLimit:5,enabled});
  const off=make(false),p=await off.preview(rec);
  assert.equal(p.count,1);assert.equal(sent.length,0);
  await assert.rejects(()=>off.send(rec,{digest:p.digest,phrase:p.phrase}),/nicht freigeschaltet/);
  const on=make(true);
  await assert.rejects(()=>on.send(rec,{digest:p.digest,phrase:'SENDEN 2'}),/Bestätigungsphrase/);
  await assert.rejects(()=>on.send(rec,{digest:'x',phrase:p.phrase}),/veraltet/);
  assert.equal(sent.length,0);
  assert.match((await on.preview({...rec,draft:{...draft,mode:'blocks'}})).blockers.join('|'),/eigenem HTML/);
});

import {requestSubscription,CONSENT_TEXT} from '../../src/newsletter/doi.mjs';
test('double opt-in: mail only for a fresh pending request, neutral otherwise, honeypot ignored, confirm activates',async()=>{
  const subs=new NewsletterSubscribers(new MemorySubscriberStore(),{secret:'s'.repeat(40),idKey:'k'.repeat(40)});
  const sent=[],resend={send:async m=>{sent.push(m);return {id:'x'};}};
  const call=(email,hp)=>requestSubscription({subscribers:subs,resend,from:'N <n@news.example.invalid>',baseUrl:'https://example.invalid',email,hp});
  assert.deepEqual(await call('a@example.invalid','bot'),{ok:true});assert.equal(sent.length,0);
  assert.equal((await call('kaputt')).ok,false);
  assert.deepEqual(await call('A@Example.invalid'),{ok:true});assert.equal(sent.length,1);
  assert.deepEqual(await call('a@example.invalid'),{ok:true});assert.equal(sent.length,1,'throttled, no second mail');
  assert.equal((await subs.mailable()).length,0,'pending is not mailable');
  const token=new URL(sent[0].text.match(/https:\S+/)[0]).searchParams.get('t');
  const c=await subs.confirm(token);assert.equal(c.ok,true);assert.equal(c.source,'website');assert.equal(typeof c.id,'string');
  assert.equal((await subs.confirm(token)).ok,false,'second confirm is a no-op');
  assert.equal((await subs.mailable()).length,1);
  assert.equal(CONSENT_TEXT.length>10,true);
});

test('browser-view placeholder is only filled for the exactly published revision',async()=>{
  const draft={kind:'newsletter',slug:'sommer',mode:'custom',subject:'S',code:{html:'<a href="{{webansicht}}">Browser</a> {{abmeldelink}}',text:'{{webansicht}} {{abmeldelink}}'}};
  const sent=[];
  const nl=createNewsletterSender({getStatus:()=>({webhookConfigured:true}),getSubscribers:()=>({mailable:async()=>[{id:'a',email:'a@example.invalid',unsubscribeToken:'t.t'}]}),getResend:()=>({send:async m=>{sent.push(m);return {id:'p'};}}),from:'N <n@news.example.invalid>',baseUrl:'https://example.invalid',dailyLimit:5,enabled:true});
  assert.match((await nl.preview({id:'abc',draft,published:null,revision:2})).blockers.join('|'),/nicht veröffentlicht/);
  await assert.rejects(()=>nl.send({id:'abc',draft,published:null,revision:2},{}),/nicht veröffentlicht/);
  assert.match((await nl.preview({id:'abc',draft,published:{revision:1},revision:2})).blockers.join('|'),/nicht veröffentlicht oder nicht auf dem aktuellen Stand/);
  const rec={id:'abc',draft,published:{revision:2},revision:2},p=await nl.preview(rec);
  const r=await nl.send(rec,{digest:p.digest,phrase:p.phrase});
  assert.equal(r.sent,1);assert.match(sent[0].html,/href="https:\/\/paulikreisch\.de\/nl\/view\/sommer"/);
  assert.match(sent[0].html,/nl\/unsubscribe\?t=/);assert.doesNotMatch(sent[0].html+sent[0].text,/\{\{/);
});

test('private preflight uses read-only capability with public store off and never exposes recipient data',async()=>{
  let reads=0,providers=0,writes=0;
  const nl=createNewsletterSender({getSubscribers:()=>{writes++;throw Error('public store off');},getReadModel:()=>({snapshot:async()=>{reads++;return {counts:{pending:2,active:1,unsubscribed:3,suppressed:4},recipients:[{id:'private-id-only'}]};}}),getStatus:()=>({storeEnabled:false,providerConfigured:false}),getResend:()=>{providers++;throw Error('no provider');},from:'',baseUrl:'https://example.invalid',dailyLimit:100,enabled:false});
  const rec={id:'record',revision:5,published:null,draft:{kind:'newsletter',mode:'custom',slug:'sommer',subject:'S',code:{html:'<a href="{{webansicht}}">Browser</a> {{abmeldelink}}',text:'{{webansicht}} {{abmeldelink}}'}}};
  const p=await nl.preview(rec);
  assert.equal(p.count,1);assert.equal(p.ready,false);assert.equal(p.counts.suppressed,4);assert.ok(p.digest);assert.equal(p.publishedCurrent,false);
  assert.match(p.blockers.join('|'),/nicht veröffentlicht/);assert.doesNotMatch(p.blockers.join('|'),/Schreibpfade sind gesperrt/);
  assert.doesNotMatch(JSON.stringify(p),/private-id-only|unsubscribeToken|VORSCHAU-KEIN-TOKEN/);
  await assert.rejects(()=>nl.send(rec,{digest:p.digest,phrase:p.phrase}),/nicht freigeschaltet/);
  assert.equal(reads,1);assert.equal(writes,0);assert.equal(providers,0);
});

test('read failure is not represented as zero recipients and private preflight stays available',async()=>{
  const nl=createNewsletterSender({getReadModel:()=>({snapshot:async()=>{throw Error('private backend details');}}),getResend:()=>{throw Error('forbidden');},getSubscribers:()=>{throw Error('forbidden');},from:'',enabled:false,dailyLimit:100});
  const p=await nl.preview({revision:1,draft:{kind:'newsletter',mode:'custom',slug:'s',subject:'S',code:{html:'{{abmeldelink}}',text:'{{abmeldelink}}'}}});
  assert.equal(p.count,null);assert.equal(p.counts,null);assert.equal(p.digest,null);assert.equal(p.ready,false);assert.match(p.blockers.join('|'),/nicht gelesen/);assert.doesNotMatch(JSON.stringify(p),/private backend details/);
});

import {summarizeNewsletterRecipients} from '../../src/newsletter/read-model.mjs';
test('read projection counts all states but returns eligible ids only, no personal fields',()=>{
  const rows=[{id:'ok',status:'active',confirmedAt:'2026-11-16',consent:{text:'yes'},email:'private@example.invalid',unsubscribeToken:'private-token'},...['pending','unsubscribed','suppressed'].map(status=>({id:status,status,email:'private@example.invalid'})),{id:'no-consent',status:'active',confirmedAt:'x'},{id:'legacy',email:'private@example.invalid'}];
  const before=JSON.stringify(rows),p=summarizeNewsletterRecipients(rows);
  assert.deepEqual(p,{counts:{pending:1,active:2,unsubscribed:1,suppressed:1},recipients:[{id:'ok'}]});
  assert.doesNotMatch(JSON.stringify(p),/email|token|consent|private@/);assert.equal(JSON.stringify(rows),before);
});

import {createMarketingHandler} from '../../src/marketing/http.mjs';
test('private preflight route requires studio auth and CSRF before invoking read model',async()=>{
  let reads=0;
  const service={get:async()=>({draft:{kind:'newsletter'}})};
  const newsletter={preview:async()=>{reads++;return {count:0};}};
  const url='https://m.paulikreisch.de/api/marketing/documents/18ecf984-fe6c-4300-bf21-73fe1257b5ae/send-preview';
  const req=csrf=>new Request(url,{method:'POST',headers:{origin:'https://m.paulikreisch.de','content-type':'application/json',...(csrf?{'x-csrf-token':csrf}:{})},body:'{}'});
  const anonymous=createMarketingHandler({service,newsletter,assets:{},auth:{session:async()=>null}});
  assert.equal((await anonymous(req('x'))).status,401);assert.equal(reads,0);
  const authenticated=createMarketingHandler({service,newsletter,assets:{},auth:{session:async()=>({csrf:'valid'})}});
  assert.equal((await authenticated(req('wrong'))).status,403);assert.equal(reads,0);
  assert.equal((await authenticated(req('valid'))).status,200);assert.equal(reads,1);
});

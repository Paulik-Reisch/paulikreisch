import test from 'node:test';
import assert from 'node:assert/strict';
import {createTransportTest,TRANSPORT_PROBE,PROBE_DIGEST,PROBE_PHRASE} from '../../src/newsletter/transport-test.mjs';
import {createNewsletterSender} from '../../src/newsletter/studio-api.mjs';
import {createMemoryControl} from '../../src/newsletter/send-control.mjs';
import {NewsletterSubscribers,MemorySubscriberStore} from '../../src/newsletter/subscribers.mjs';
import {createMarketingHandler} from '../../src/marketing/http.mjs';
const approval={digest:PROBE_DIGEST,phrase:PROBE_PHRASE};
function probeFixture({enabled=true,configured=true,fail=false}={}){
 let claimed=false,claims=0;const messages=[];
 const transport=createTransportTest({enabled,configured,claim:async()=>{claims++;if(claimed)return false;claimed=true;return true;},getProvider:()=>({send:async(m,opts)=>{messages.push({m,opts});if(fail)throw Error('timeout');return {id:'provider-fixture'};}})});
 return {transport,messages,claims:()=>claims};
}
test('transport preview and disabled send never claim storage or call provider',async()=>{
 const f=probeFixture({enabled:false});assert.equal(f.transport.preview().to,'philipp.l.paulik@gmail.com');
 await assert.rejects(()=>f.transport.send(approval),/nicht freigeschaltet/);assert.equal(f.claims(),0);assert.equal(f.messages.length,0);
});
test('wrong test confirmation never claims storage or calls provider',async()=>{
 const f=probeFixture();await assert.rejects(()=>f.transport.send({...approval,phrase:'wrong'}),/stimmt nicht/);assert.equal(f.claims(),0);assert.equal(f.messages.length,0);
});
test('concurrent transport requests send exactly one fixed message and ignore recipient overrides',async()=>{
 const f=probeFixture();const results=await Promise.allSettled([f.transport.send({...approval,to:'attacker@example.invalid'}),f.transport.send(approval)]);
 assert.equal(results.filter(x=>x.status==='fulfilled').length,1);assert.equal(f.messages.length,1);
 assert.deepEqual(f.messages[0].m.to,['philipp.l.paulik@gmail.com']);assert.equal(f.messages[0].m.from,'Paulik & Reisch <newsletter@news.paulikreisch.de>');
 assert.equal(f.messages[0].m.subject,'Paulik & Reisch: Versandtest');assert.equal(f.messages[0].m.text,TRANSPORT_PROBE.text);assert.equal(f.messages[0].m.headers,undefined);
});
test('ambiguous provider failure consumes probe permanently, never automatically retries',async()=>{
 const f=probeFixture({fail:true});await assert.rejects(()=>f.transport.send(approval),/timeout/);
 await assert.rejects(()=>f.transport.send(approval),/bereits beansprucht/);assert.equal(f.messages.length,1);
});
const doc={id:'newsletter-fixture',revision:1,draft:{kind:'newsletter',mode:'custom',slug:'s',subject:'S',code:{html:'{{abmeldelink}}',text:'{{abmeldelink}}'}}};
function senderFixture({feedback=true}={}){
 const sent=[];const sender=createNewsletterSender({getStatus:()=>({storeEnabled:false,webhookConfigured:feedback}),enabled:true,from:'N <n@news.example.invalid>',baseUrl:'https://example.invalid',dailyLimit:10,control:createMemoryControl(),
 getReadModel:()=>({snapshot:async()=>({counts:{active:1,pending:0,unsubscribed:0,suppressed:0},recipients:[{id:'fixture'}]})}),
 getSubscribers:()=>Object.freeze({mailable:async()=>[{id:'fixture',email:'only@example.invalid',unsubscribeToken:'fixture-token'}]}),getResend:()=>({send:async m=>{sent.push(m);return {id:'fixture'};}})});return {sender,sent};
}
test('campaign can send through narrow mailing capability while public registration remains off',async()=>{
 const f=senderFixture();let p=await f.sender.preview(doc);assert.equal(p.ready,false);assert.equal(p.approvable,true);p=await f.sender.approve(doc,{digest:p.digest,phrase:p.approvalPhrase,actor:'t'});assert.equal(p.ready,true);
 assert.equal((await f.sender.send(doc,{digest:p.digest,phrase:p.phrase})).sent,1);assert.equal(f.sent.length,1);
});
test('missing active feedback blocks preview and direct campaign send',async()=>{
 const f=senderFixture({feedback:false});const p=await f.sender.preview(doc);assert.equal(p.ready,false);assert.match(p.blockers.join('|'),/Rückkanal/);
 await assert.rejects(()=>f.sender.send(doc,{digest:p.digest,phrase:p.phrase}),/Rückkanal/);assert.equal(f.sent.length,0);
});
test('feedback existingOnly never creates unknown recipients and is idempotent',async()=>{
 const store=new MemorySubscriberStore(),subs=new NewsletterSubscribers(store,{secret:'x'.repeat(40),now:()=> '2026-11-16T12:00:00Z'});
 await subs.suppress('unknown@example.invalid','bounce',{existingOnly:true});assert.deepEqual(await store.list(),[]);
 const r=await subs.subscribe('known@example.invalid',{source:'fixture',consentText:'fixture consent only',consentVersion:'v1'});await subs.confirm(r.confirmToken);
 await subs.suppress('known@example.invalid','bounce',{existingOnly:true});const once=await store.list();
 await subs.suppress('known@example.invalid','bounce',{existingOnly:true});assert.deepEqual(await store.list(),once);assert.equal(once[0].status,'suppressed');assert.equal((await subs.mailable()).length,0);
});
function handlerFixture(session={email:'philipp.l.paulik@gmail.com',csrf:'fixture-csrf'}){
 const f=probeFixture();return {...f,handler:createMarketingHandler({service:{},auth:{session:async()=>session},assets:{},transportTest:f.transport})};
}
const request=(path,method='POST',csrf='fixture-csrf',origin='https://m.paulikreisch.de')=>new Request('https://m.paulikreisch.de'+path,{method,headers:{'content-type':'application/json',origin,'x-csrf-token':csrf},...(method==='POST'?{body:JSON.stringify(approval)}:{})});
test('private probe route rejects anonymous requests before claim',async()=>{
 const f=handlerFixture(null);assert.equal((await f.handler(request('/api/marketing/newsletter/transport-test'))).status,401);assert.equal(f.claims(),0);
});
test('private probe route rejects wrong CSRF and origin before claim',async()=>{
 const f=handlerFixture();assert.equal((await f.handler(request('/api/marketing/newsletter/transport-test','POST','wrong'))).status,403);
 assert.equal((await f.handler(request('/api/marketing/newsletter/transport-test','POST','fixture-csrf','https://bad.invalid'))).status,403);assert.equal(f.claims(),0);
});
test('authenticated transport GET is review only and POST has fixed single-send semantics',async()=>{
 const f=handlerFixture();const p=await f.handler(request('/api/marketing/newsletter/transport-test','GET'));assert.equal(p.status,200);assert.equal(f.claims(),0);
 assert.equal((await f.handler(request('/api/marketing/newsletter/transport-test'))).status,200);
 assert.equal((await f.handler(request('/api/marketing/newsletter/transport-test'))).status,409);assert.equal(f.messages.length,1);
});

test('omitted feedback configuration fails closed even when SEND is enabled',async()=>{
 const sender=createNewsletterSender({enabled:true,from:'a@example.invalid',getSubscribers:()=>{throw Error('must not read recipients');}});
 await assert.rejects(()=>sender.send(doc,approval),/Rückkanal/);
});

test('fixed transport probe HTML is escaped without changing approval identity or content',async()=>{
 const f=probeFixture();await f.transport.send(approval);
 assert.equal(f.messages[0].m.html,'<p>Das ist der einmalige technische Versandtest von Paulik &amp; Reisch. Es wurde kein Newsletter-Abo angelegt und niemand sonst angeschrieben. Antworten gehen an philipp.l.paulik@gmail.com.</p>');
 assert.equal(f.messages[0].m.text,TRANSPORT_PROBE.text);
 assert.equal(f.messages[0].opts.idempotencyKey,'newsletter-transport-v1:'+PROBE_DIGEST);
});

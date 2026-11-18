import test from 'node:test';
import assert from 'node:assert/strict';
import {createNewsletterSender} from '../../src/newsletter/studio-api.mjs';
import {createMemoryControl,APPROVAL_TTL_MS} from '../../src/newsletter/send-control.mjs';
const draft={kind:'newsletter',slug:'s',mode:'custom',subject:'S',code:{html:'{{abmeldelink}}',text:'{{abmeldelink}}'}};
const rec={id:'doc1',revision:2,draft,published:null};
function make({enabled=true,recipients=['a'],resend,control=createMemoryControl(),clock}={}){
  const sent=[];let t=clock?.t??1_000_000;
  const sender=createNewsletterSender({control,now:()=>t,enabled,from:'N <n@news.example.invalid>',baseUrl:'https://example.invalid',dailyLimit:10,
    getStatus:()=>({webhookConfigured:true}),
    getReadModel:()=>({snapshot:async()=>({counts:{},recipients:recipients.map(id=>({id}))})}),
    getSubscribers:()=>({mailable:async()=>recipients.map(id=>({id,email:id+'@example.invalid',unsubscribeToken:'t.'+id}))}),
    getResend:()=>resend??({send:async m=>{sent.push(m);return {id:'p'};}})});
  return {sender,sent,control,advance:ms=>{t+=ms;}};
}
const approve=async(f,r=rec)=>{const p=await f.sender.preview(r);return f.sender.approve(r,{digest:p.digest,phrase:p.approvalPhrase,actor:'philipp'});};
test('approval is separate from sending: approving sends nothing and needs digest and phrase',async()=>{
  const f=make();const p=await f.sender.preview(rec);
  assert.equal(p.approvable,true);assert.equal(p.ready,false);assert.equal(p.approval.state,'none');
  await assert.rejects(()=>f.sender.approve(rec,{digest:p.digest,phrase:'FREIGEBEN 9',actor:'x'}),/Bestätigungsphrase/);
  await assert.rejects(()=>f.sender.approve(rec,{digest:'x',phrase:p.approvalPhrase,actor:'x'}),/veraltet/);
  const a=await approve(f);assert.equal(a.approval.state,'approved');assert.equal(a.ready,true);assert.equal(f.sent.length,0);
  assert.equal(Date.parse(a.approval.expiresAt)-1_000_000,APPROVAL_TTL_MS);
});
test('send without a valid approval is refused, also when digest and phrase are right',async()=>{
  const f=make();const p=await f.sender.preview(rec);
  await assert.rejects(()=>f.sender.send(rec,{digest:p.digest,phrase:p.phrase}),/Versandfreigabe/);assert.equal(f.sent.length,0);
});
test('approval goes stale when the recipient set changes, expires, and can be revoked',async()=>{
  const f=make();await approve(f);
  const g=make({control:f.control,recipients:['a','b']});
  const p=await g.sender.preview(rec);assert.equal(p.approval.state,'stale');assert.equal(p.ready,false);
  await assert.rejects(()=>g.sender.send(rec,{digest:p.digest,phrase:p.phrase}),/Versandfreigabe/);
  const h=make({control:f.control});h.advance(APPROVAL_TTL_MS+1);
  assert.equal((await h.sender.preview(rec)).approval.state,'expired');
  const k=make({control:f.control});assert.equal((await k.sender.preview(rec)).approval.state,'approved');
  assert.equal((await k.sender.revokeApproval(rec,{actor:'p'})).approval.state,'revoked');
  const p2=await k.sender.preview(rec);await assert.rejects(()=>k.sender.send(rec,{digest:p2.digest,phrase:p2.phrase}),/Versandfreigabe/);
  assert.equal((await approve(k)).approval.state,'approved','re-approval after revoke is possible');
});
test('the global SEND switch stays an emergency brake even with an approval',async()=>{
  const f=make({enabled:false});const a=await approve(f);
  assert.equal(a.approval.state,'approved');assert.equal(a.ready,false);assert.match(a.blockers.join('|'),/Notbremse/);
  await assert.rejects(()=>f.sender.send(rec,{digest:a.digest,phrase:a.phrase}),/nicht freigeschaltet/);assert.equal(f.sent.length,0);
});
test('a revision is sent once: durable claim blocks repeats, also with a lost response',async()=>{
  const f=make();const a=await approve(f);
  const r=await f.sender.send(rec,{digest:a.digest,phrase:a.phrase});assert.equal(r.sent,1);
  const p=await f.sender.preview(rec);assert.equal(p.sendState.state,'finished');assert.equal(p.sendState.sent,1);assert.equal(p.ready,false);assert.equal(p.approvable,false);
  await assert.rejects(()=>f.sender.send(rec,{digest:a.digest,phrase:a.phrase}),/beansprucht/);
  await assert.rejects(()=>f.sender.revokeApproval(rec,{actor:'p'}),/bereits begonnen/);
  assert.equal(f.sent.length,1);
});
test('provider error after claim keeps the claim; content errors block approval',async()=>{
  const boom=make({resend:{send:async()=>{const e=new Error('x');e.status=500;throw e;}}});
  const a=await approve(boom);const r=await boom.sender.send(rec,{digest:a.digest,phrase:a.phrase});assert.equal(r.failed,1);
  assert.equal((await boom.sender.preview(rec)).sendState.state,'finished');
  await assert.rejects(()=>boom.sender.send(rec,{digest:a.digest,phrase:a.phrase}),/beansprucht/);
  // Content errors are blockers at preview time, so no approval and no claim exist for them.
  const bad={...rec,id:'doc2',draft:{...draft,code:{html:'{{abmeldelink}} {{unbekannt}}',text:'{{abmeldelink}}'}}};
  const f=make();const p=await f.sender.preview(bad);assert.equal(p.approvable,false);
  await assert.rejects(()=>f.sender.approve(bad,{digest:p.digest,phrase:p.approvalPhrase}),/Platzhalter/);
  assert.equal(f.sent.length,0);
});
test('without a control store nothing can be approved or sent',async()=>{
  const f=make({control:null});const p=await f.sender.preview(rec);
  assert.equal(p.approvable,false);await assert.rejects(()=>f.sender.approve(rec,{digest:p.digest,phrase:p.approvalPhrase}),/Freigabespeicher/);
  await assert.rejects(()=>f.sender.send(rec,{digest:p.digest,phrase:p.phrase}),/Freigabespeicher/);
});

test('claim is written only right before the first provider call',async()=>{
  // Provider client cannot be created: nothing was attempted, so the claim must stay free.
  const f=make();const a=await approve(f);
  const broken=createNewsletterSender({control:f.control,now:()=>1_000_000,enabled:true,from:'N <n@news.example.invalid>',baseUrl:'https://example.invalid',dailyLimit:10,
    getStatus:()=>({webhookConfigured:true}),getReadModel:()=>({snapshot:async()=>({counts:{},recipients:[{id:'a'}]})}),
    getSubscribers:()=>({mailable:async()=>[{id:'a',email:'a@example.invalid',unsubscribeToken:'t.a'}]}),getResend:()=>{throw new Error('key missing');}});
  await assert.rejects(()=>broken.send(rec,{digest:a.digest,phrase:a.phrase}),/key missing/);
  assert.equal((await f.control.read('send-doc1-r2')),null,'no claim without a provider call');
  const r=await f.sender.send(rec,{digest:a.digest,phrase:a.phrase});assert.equal(r.sent,1);
});
test('partial send then crash or provider stop never allows a second send of that revision',async()=>{
  let n=0;const sent=[];
  const f=make({recipients:['a','b','c'],resend:{send:async m=>{n++;if(n===2){const e=new Error('rate');e.status=429;throw e;}sent.push(m);return {id:'p'+n};}}});
  const a=await approve(f);const r=await f.sender.send(rec,{digest:a.digest,phrase:a.phrase});
  assert.deepEqual([r.sent,r.failed,r.notAttempted],[1,1,1]);
  const p=await f.sender.preview(rec);assert.equal(p.sendState.state,'finished');assert.equal(p.sendState.notAttempted,1);
  await assert.rejects(()=>f.sender.send(rec,{digest:a.digest,phrase:a.phrase}),/beansprucht/);
  // crash after the claim: the final result write is lost, the claim stays 'claimed'
  const g=make({control:createMemoryControl(),resend:{send:async()=>{throw Object.assign(new Error('boom'),{status:0});}}});
  const orig=g.control.update;g.control.update=async()=>{throw new Error('process died');};
  const b=await approve(g);const lost=await g.sender.send(rec,{digest:b.digest,phrase:b.phrase});assert.equal(lost.failed,1);
  g.control.update=orig;
  assert.equal((await g.sender.preview(rec)).sendState.state,'claimed');
  await assert.rejects(()=>g.sender.send(rec,{digest:b.digest,phrase:b.phrase}),/beansprucht/);
  assert.equal(sent.length,1);
});

import {createMarketingHandler} from '../../src/marketing/http.mjs';
const ID='8e8f52ae-297f-4483-b3c2-03656b48dc38';
function httpFixture({session={email:'philipp@example.invalid',csrf:'csrf-1'}}={}){
  const f=make();const record={...rec,id:ID};
  const handler=createMarketingHandler({service:{get:async()=>record},auth:{session:async()=>session},assets:{},newsletter:f.sender});
  const call=(action,{host='m.paulikreisch.de',csrf='csrf-1',origin=`https://${host}`,body={}}={})=>handler(new Request(`https://${host}/api/marketing/documents/${ID}/${action}`,{method:'POST',headers:{'content-type':'application/json',origin,'x-csrf-token':csrf},body:JSON.stringify(body)}));
  return {...f,call,record};
}
test('http: approve and revoke need session, CSRF, same origin and the manager host',async()=>{
  const none=httpFixture({session:null});assert.equal((await none.call('approve')).status,401);
  const f=httpFixture();
  assert.equal((await f.call('approve',{csrf:'wrong'})).status,403);
  assert.equal((await f.call('approve',{origin:'https://evil.invalid'})).status,403);
  assert.equal((await f.call('revoke-approval',{csrf:'wrong'})).status,403);
  for(const host of ['lp.paulikreisch.de','ads.paulikreisch.de']){
    for(const action of ['approve','revoke-approval','send','send-preview'])assert.equal((await f.call(action,{host})).status,404,host+' '+action);
  }
  assert.equal((await f.control.read('approval-'+ID+'-r2')),null);
  assert.equal(f.sent.length,0);
});
test('http: invalid digest or phrase refuses approval, valid one approves without sending, send needs approval',async()=>{
  const f=httpFixture();
  const p=await (await f.call('send-preview')).json();assert.equal(p.approval.state,'none');
  assert.equal((await f.call('send',{body:{digest:p.digest,phrase:p.phrase}})).status,409);
  assert.equal((await f.call('approve',{body:{digest:'bad',phrase:p.approvalPhrase}})).status,409);
  assert.equal((await f.call('approve',{body:{digest:p.digest,phrase:'FREIGEBEN 99'}})).status,409);
  assert.equal((await f.call('approve',{body:{}})).status,409);
  const ok=await f.call('approve',{body:{digest:p.digest,phrase:p.approvalPhrase}});assert.equal(ok.status,200);
  const a=await ok.json();assert.equal(a.approval.state,'approved');assert.equal(f.sent.length,0);
  assert.equal((await f.call('send',{body:{digest:'bad',phrase:a.phrase}})).status,409);assert.equal(f.sent.length,0);
  assert.equal((await f.call('send',{body:{digest:a.digest,phrase:a.phrase}})).status,200);assert.equal(f.sent.length,1);
  assert.equal((await f.call('send',{body:{digest:a.digest,phrase:a.phrase}})).status,409);assert.equal(f.sent.length,1);
  assert.equal((await f.call('revoke-approval')).status,409,'no revoke after send began');
});

test('unpublished or outdated browser view blocks approval and send, also when the approval existed before',async()=>{
  const web={...draft,code:{html:'<a href="{{webansicht}}">b</a> {{abmeldelink}}',text:'{{webansicht}} {{abmeldelink}}'}};
  const live={id:'doc3',revision:4,draft:web,published:{revision:4}};
  const f=make();
  const p0=await f.sender.preview({...live,published:null});
  assert.equal(p0.approvable,false);assert.match(p0.blockers.join('|'),/Browseransicht/);
  await assert.rejects(()=>f.sender.approve({...live,published:null},{digest:p0.digest,phrase:p0.approvalPhrase}),/Browseransicht/);
  const a=await approve(f,live);assert.equal(a.approval.state,'approved');assert.equal(a.ready,true);assert.equal(a.publishedCurrent,true);
  // View withdrawn after approval (same revision number): approval exists but send is blocked.
  const withdrawn={...live,published:null},pw=await f.sender.preview(withdrawn);
  assert.equal(pw.approval.state,'approved');assert.equal(pw.ready,false);assert.match(pw.blockers.join('|'),/Browseransicht/);
  await assert.rejects(()=>f.sender.send(withdrawn,{digest:a.digest,phrase:a.phrase}),/Browseransicht/);
  // Older published snapshot than the saved revision: also blocked.
  const old={...live,published:{revision:3}};
  assert.equal((await f.sender.preview(old)).ready,false);
  await assert.rejects(()=>f.sender.send(old,{digest:a.digest,phrase:a.phrase}),/Browseransicht/);
  assert.equal(f.sent.length,0);
  // Real publish/unpublish bump the revision, which voids an approval given for the older number.
  const bumped=await f.sender.preview({...live,revision:5,published:{revision:5}});assert.equal(bumped.approval.state,'none');assert.equal(bumped.ready,false);
});

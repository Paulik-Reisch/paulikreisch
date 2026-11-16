import test from 'node:test';import assert from 'node:assert/strict';
import {NewsletterSubscribers,MemorySubscriberStore} from '../../src/newsletter/subscribers.mjs';
import {runSequence,nextStep,defaultSteps,DAY_MS,RETRY_MS,MAX_ATTEMPTS} from '../../src/newsletter/sequence.mjs';
const SECRET='x'.repeat(40),consent={source:'test',consentText:'Ich willige in den Newsletter ein.',consentVersion:'v1'};
const setup=()=>{let t=Date.parse('2026-11-16T12:00:00Z');const store=new MemorySubscriberStore();const subs=new NewsletterSubscribers(store,{secret:SECRET,now:()=>new Date(t).toISOString()});
  const sent=[];const seen=new Set();let fail=0;
  const provider={async send(m,{idempotencyKey}){if(fail>0){fail--;throw new Error('provider down');}if(seen.has(idempotencyKey))return {id:'dup'};seen.add(idempotencyKey);sent.push({to:m.to[0],key:idempotencyKey,subject:m.subject,headers:m.headers});return {id:'x'};}};
  const opts=()=>({store,subscribers:subs,provider,content:k=>({subject:'Test '+k,html:'<p>x</p>',text:'x'}),from:'a@news.example',listHeaders:tk=>({'List-Unsubscribe':`<https://x/u/${tk}>`}),unsubscribeUrl:tk=>'https://x/'+tk,now:()=>t,enabled:true});
  return {store,subs,sent,provider,opts,adv:ms=>{t+=ms;},failNext:n=>{fail=n;}};};
async function activate(subs,email){const r=await subs.subscribe(email,consent);await subs.confirm(r.confirmToken);}
test('disabled by default: sends nothing',async()=>{
  const s=setup();await activate(s.subs,'a@example.de');s.adv(8*DAY_MS);
  const o=s.opts();delete o.enabled;assert.equal((await runSequence(o)).disabled,true);assert.equal(s.sent.length,0);
});
test('steps go in order, each once, only when due',async()=>{
  const s=setup();await activate(s.subs,'a@example.de');
  await runSequence(s.opts());assert.equal(s.sent.length,0);
  s.adv(DAY_MS);await runSequence(s.opts());assert.deepEqual(s.sent.map(x=>x.subject),['Test day1']);
  await runSequence(s.opts());assert.equal(s.sent.length,1);
  s.adv(7*DAY_MS);await runSequence(s.opts());assert.deepEqual(s.sent.map(x=>x.subject),['Test day1','Test day3']);
  await runSequence(s.opts());await runSequence(s.opts());await runSequence(s.opts());
  assert.deepEqual(s.sent.map(x=>x.subject),['Test day1','Test day3','Test day5','Test day7']);
  await runSequence(s.opts());assert.equal(s.sent.length,4);
});
test('pending, unsubscribed and suppressed people get nothing',async()=>{
  const s=setup();
  await s.subs.subscribe('pending@example.de',consent);
  await activate(s.subs,'unsub@example.de');await activate(s.subs,'bounce@example.de');
  const u=(await s.store.list()).find(r=>r.email==='unsub@example.de');await s.subs.unsubscribe(s.subs.unsubscribeToken(u));
  await s.subs.suppress('bounce@example.de','bounce');
  s.adv(8*DAY_MS);await runSequence(s.opts());assert.equal(s.sent.length,0);
});
test('unsubscribe between steps stops the sequence',async()=>{
  const s=setup();await activate(s.subs,'a@example.de');
  s.adv(DAY_MS);await runSequence(s.opts());assert.equal(s.sent.length,1);
  const r=(await s.store.list())[0];await s.subs.unsubscribe(s.subs.unsubscribeToken(r));
  s.adv(10*DAY_MS);await runSequence(s.opts());assert.equal(s.sent.length,1);
});
test('failed send is retried after a pause, then parked after the attempt limit; no duplicates',async()=>{
  const s=setup();await activate(s.subs,'a@example.de');s.adv(DAY_MS);
  s.failNext(1);let r=await runSequence(s.opts());assert.equal(r.failed,1);assert.equal(s.sent.length,0);
  r=await runSequence(s.opts());assert.equal(s.sent.length,0);
  s.adv(RETRY_MS+1);await runSequence(s.opts());assert.equal(s.sent.length,1);
  const t=setup();await activate(t.subs,'b@example.de');t.adv(DAY_MS);t.failNext(99);
  for(let i=0;i<MAX_ATTEMPTS+2;i++){await runSequence(t.opts());t.adv(RETRY_MS+1);}
  const rec=(await t.store.list())[0];assert.ok(rec.sequence.day1.failedAt);assert.equal(rec.sequence.day1.attempts,MAX_ATTEMPTS);assert.equal(t.sent.length,0);
});
test('limit caps one run; missing content skips; mails carry list headers',async()=>{
  const s=setup();for(const e of ['a','b','c'])await activate(s.subs,e+'@example.de');s.adv(DAY_MS);
  const o=s.opts();o.limit=2;await runSequence(o);assert.equal(s.sent.length,2);assert.ok(s.sent[0].headers['List-Unsubscribe']);
  const p=setup();await activate(p.subs,'z@example.de');p.adv(DAY_MS);const q=p.opts();q.content=()=>null;const r=await runSequence(q);assert.equal(r.skipped,1);assert.equal(p.sent.length,0);
});
test('nextStep ignores legacy-like records without consent',()=>{
  assert.equal(nextStep({status:'active',confirmedAt:'2020-01-01T00:00:00Z'},defaultSteps,Date.now()),null);
  assert.equal(nextStep({status:'pending'},defaultSteps,Date.now()),null);
});

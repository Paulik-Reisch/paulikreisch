import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {createHmac} from 'node:crypto';
import ts from 'typescript';
import {NextResponse} from 'next/server';
// @ts-ignore Plain ESM production modules.
import * as subscribers from '../../src/newsletter/subscribers.mjs';
// @ts-ignore Plain ESM production modules.
import * as tokens from '../../src/newsletter/tokens.mjs';
// @ts-ignore Plain ESM production modules.
import * as webhook from '../../src/newsletter/webhook.mjs';
// @ts-ignore Plain ESM production modules.
import * as marketing from '../../src/marketing/service.mjs';
// @ts-ignore Plain ESM production modules.
import * as render from '../../src/marketing/render.mjs';
const SECRET='fixture-token-secret-only-'.repeat(2),OLD='fixture-previous-secret-only-'.repeat(2),IDKEY='fixture-id-key-only-'.repeat(3);
const FROM='Fixture Sender <fixture@news.example.invalid>',EMAIL='fixture@example.invalid';
const WH='whsec_'+Buffer.from('fixture-webhook-secret-not-a-real-key').toString('base64');
function load(file:string,dependencies:Record<string,unknown>,env:Record<string,string>,errors:string[]=[]){
 const module={exports:{} as Record<string,any>};
 const compiled=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 runInNewContext(compiled,{module,exports:module.exports,Request,Response,URL,Buffer,process:{env},console:{error:(s:string)=>errors.push(s)},require:(name:string)=>{
  if(name==='server-only')return {};
  if(name in dependencies)return dependencies[name];
  throw Error('Unexpected dependency: '+name);
 }});
 return module.exports;
}
function fixture(overrides:Record<string,string>={}){
 const store=new subscribers.MemorySubscriberStore(),errors:string[]=[];let dbCalls=0;
 const env={NEWSLETTER_TOKEN_SECRET:SECRET,NEWSLETTER_ID_KEY:IDKEY,NEWSLETTER_UNSUBSCRIBE_ENABLED:'1',NEWSLETTER_FEEDBACK_ENABLED:'1',NEWSLETTER_RESEND_WEBHOOK_SECRET:WH,NEWSLETTER_FROM:FROM,...overrides};
 const server=load('src/newsletter/server.ts',{
  '@/lib/firebase-admin':{getAdminDb:()=>{dbCalls++;return {}; }},
  './subscribers.mjs':subscribers,'./tokens.mjs':tokens,
  './firestore-store.mjs':{FirestoreSubscriberStore:class{constructor(){return store;}}},
 },env,errors);
 const deps={'next/server':{NextResponse},'@/newsletter/server':server,'@/newsletter/webhook.mjs':webhook};
 const manual=load('src/app/nl/unsubscribe/confirm/route.ts',deps,env,errors);
 const oneClick=load('src/app/nl/unsubscribe/one-click/route.ts',deps,env,errors);
 const feedback=load('src/app/api/newsletter/webhook/route.ts',deps,env,errors);
 const id=subscribers.recipientId(IDKEY,EMAIL),token=tokens.tokenFor(SECRET,'unsubscribe',id);
 const seed=async()=>store.update(id,()=>({record:{id,email:EMAIL,status:'active',confirmedAt:'2026-11-01T10:00:00Z',consent:{text:'Fixture consent, no real signup.'}},value:null}));
 return {store,server,manual,oneClick,feedback,id,token,seed,errors,dbCalls:()=>dbCalls};
}
function manualRequest(token:string){return new Request('https://example.invalid/nl/unsubscribe/confirm',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({token})});}
function oneClickRequest(token:string,body='List-Unsubscribe=One-Click'){return new Request('https://example.invalid/nl/unsubscribe/one-click?t='+encodeURIComponent(token),{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});}
function signed(event:unknown,{timestamp=String(Math.floor(Date.now()/1000)),tamper=false}={}){
 const body=JSON.stringify(event),id='fixture-event';
 const signature=createHmac('sha256',Buffer.from(WH.slice(6),'base64')).update(`${id}.${timestamp}.${body}`).digest('base64');
 return new Request('https://example.invalid/api/newsletter/webhook',{method:'POST',headers:{'svix-id':id,'svix-timestamp':timestamp,'svix-signature':'v1,'+signature},body:body+(tamper?' ':'')});
}
const bounce=(email=EMAIL,from=FROM,type='Permanent')=>({type:'email.bounced',data:{from,to:[email],bounce:{type}}});
test('manual removal runs through real route and capability while STORE and SEND remain absent',async()=>{
 const f=fixture();await f.seed();assert.equal(f.server.newsletterStoreEnabled(),false);assert.throws(()=>f.server.getNewsletterSubscribers(),/disabled/);assert.throws(()=>f.server.getNewsletterMailingRecipients(),/disabled/);
 const first=await f.manual.POST(manualRequest(f.token));assert.equal(first.status,200);assert.equal((await first.json()).ok,true);assert.equal((await f.store.list())[0].status,'unsubscribed');
 const after=JSON.stringify(await f.store.list());assert.equal((await f.manual.POST(manualRequest(f.token))).status,200);assert.equal(JSON.stringify(await f.store.list()),after);assert.equal(f.manual.GET,undefined);
});
test('RFC8058 route requires exact one-click body and never offers GET removal',async()=>{
 const f=fixture();await f.seed();assert.equal((await f.oneClick.POST(oneClickRequest(f.token,'wrong'))).status,400);assert.equal(f.dbCalls(),0);assert.equal((await f.store.list())[0].status,'active');
 assert.equal((await f.oneClick.POST(oneClickRequest(f.token))).status,200);assert.equal((await f.store.list())[0].status,'unsubscribed');assert.equal(f.oneClick.GET,undefined);
});
test('malformed and wrong-purpose tokens reject before constructing the database',async()=>{
 const f=fixture();assert.equal((await f.manual.POST(manualRequest('bad'))).status,400);
 assert.equal((await f.manual.POST(manualRequest(tokens.tokenFor(SECRET,'confirm',f.id)))).status,400);assert.equal(f.dbCalls(),0);assert.equal((await f.store.list()).length,0);
});
test('unknown signed token does not create a recipient or report successful removal',async()=>{
 const f=fixture();const r=await f.manual.POST(manualRequest(f.token));assert.equal(r.status,400);assert.equal((await r.json()).ok,false);assert.equal((await f.store.list()).length,0);
});
test('previous signing key can remove existing recipient but unrelated key cannot',async()=>{
 const f=fixture({NEWSLETTER_TOKEN_SECRET_PREVIOUS:OLD});await f.seed();assert.equal((await f.manual.POST(manualRequest(tokens.tokenFor('unrelated-fixture-secret'.repeat(3),'unsubscribe',f.id)))).status,400);assert.equal(f.dbCalls(),0);
 assert.equal((await f.manual.POST(manualRequest(tokens.tokenFor(OLD,'unsubscribe',f.id)))).status,200);assert.equal((await f.store.list())[0].status,'unsubscribed');
});
test('disabled removal fails closed without touching the database',async()=>{
 const f=fixture({NEWSLETTER_UNSUBSCRIBE_ENABLED:''});assert.equal((await f.manual.POST(manualRequest(f.token))).status,503);assert.equal(f.dbCalls(),0);assert.equal(f.errors.length,1);
});
test('signed permanent bounce suppresses only an existing recipient and duplicates are idempotent',async()=>{
 const f=fixture();await f.seed();assert.equal((await f.feedback.POST(signed(bounce()))).status,200);const once=JSON.stringify(await f.store.list());assert.equal((await f.store.list())[0].status,'suppressed');
 assert.equal((await f.feedback.POST(signed(bounce()))).status,200);assert.equal(JSON.stringify(await f.store.list()),once);assert.equal((await f.manual.POST(manualRequest(f.token))).status,200);assert.equal(JSON.stringify(await f.store.list()),once);
});
test('signed complaint and provider suppression stop matching existing records',async()=>{
 for(const type of ['email.complained','email.suppressed']){const f=fixture();await f.seed();const r=await f.feedback.POST(signed({type,data:{from:FROM,to:[EMAIL]}}));assert.equal(r.status,200);assert.equal((await r.json()).handled,1);assert.equal((await f.store.list())[0].status,'suppressed');}
});
test('other-project feedback, transient bounce and delivery events never open the database',async()=>{
 const f=fixture();for(const event of [bounce(EMAIL,'Other <other@example.invalid>'),bounce(EMAIL,FROM,'Transient'),{type:'email.delivered',data:{from:FROM,to:[EMAIL]}}]){const r=await f.feedback.POST(signed(event));assert.equal(r.status,200);assert.equal((await r.json()).handled,0);}assert.equal(f.dbCalls(),0);
});
test('unknown signed feedback cannot create a record or grant consent',async()=>{
 const f=fixture();assert.equal((await f.feedback.POST(signed(bounce()))).status,200);assert.equal((await f.store.list()).length,0);
});
test('unsigned, altered and stale feedback reject before database construction',async()=>{
 const f=fixture();const unsigned=new Request('https://example.invalid/api/newsletter/webhook',{method:'POST',body:JSON.stringify(bounce())});assert.equal((await f.feedback.POST(unsigned)).status,400);
 assert.equal((await f.feedback.POST(signed(bounce(),{tamper:true}))).status,400);assert.equal((await f.feedback.POST(signed(bounce(),{timestamp:'1'}))).status,400);assert.equal(f.dbCalls(),0);
});
test('disabled feedback fails closed before parsing or opening the database',async()=>{
 const f=fixture({NEWSLETTER_FEEDBACK_ENABLED:''});assert.equal((await f.feedback.POST(signed(bounce()))).status,503);assert.equal(f.dbCalls(),0);
});
function webFixture(env:Record<string,string>={}){
 const storage=new marketing.MemoryStorage();let reads=0;
 const route=load('src/app/nl/view/[slug]/route.ts',{
  '@/lib/firebase-admin':{getAdminStorage:()=>({bucket:()=>{reads++;return {};}})},
  '@/marketing/service.mjs':marketing,'@/marketing/private-bucket.mjs':{PrivateBucketStorage:class{constructor(){return storage;}}},'@/marketing/render.mjs':render,
 },{SESSION_SECRET:SECRET,MARKETING_STUDIO_RELEASE:'structured-v1-accepted',...env});
 return {storage,route,reads:()=>reads,service:new marketing.MarketingService(storage)};
}
const webDoc={kind:'newsletter',mode:'custom',name:'Local fixture',slug:'fixture-newsletter',subject:'Fixture',code:{html:'<p>Published fixture</p><a href="{{webansicht}}">Browser</a><a href="{{abmeldelink}}">Remove</a>',text:'Published fixture {{webansicht}} {{abmeldelink}}'}};
const webRequest=new Request('https://example.invalid/nl/view/fixture-newsletter');
const params=(slug='fixture-newsletter')=>({params:Promise.resolve({slug})});
test('browser route exposes only immutable published newsletter and no tokens or draft edits',async()=>{
 const f=webFixture();const d=await f.service.create(webDoc,'fixture');assert.equal((await f.route.GET(webRequest,params())).status,404);
 const published=await f.service.publish(d.id,d.revision,'fixture');await f.service.update(d.id,{...webDoc,code:{...webDoc.code,html:webDoc.code.html.replace('Published fixture','Private edit')}},published.revision,'fixture');
 const r=await f.route.GET(webRequest,params());assert.equal(r.status,200);const body=await r.text();assert.match(body,/Published fixture/);assert.doesNotMatch(body,/Private edit|\?t=|{{/);assert.match(r.headers.get('content-security-policy')!,/script-src 'none'/);assert.match(r.headers.get('x-robots-tag')!,/noindex/);
});
test('browser route rejects disabled gate and invalid slug before storage',async()=>{
 const disabled=webFixture({MARKETING_STUDIO_RELEASE:''});assert.equal((await disabled.route.GET(webRequest,params())).status,404);assert.equal(disabled.reads(),0);
 const f=webFixture();assert.equal((await f.route.GET(webRequest,params('../bad'))).status,404);assert.equal(f.reads(),0);
});

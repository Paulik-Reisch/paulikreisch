import test from 'node:test';import assert from 'node:assert/strict';
import {MarketingService,MemoryStorage} from '../../src/marketing/service.mjs';import {createMarketingHandler} from '../../src/marketing/http.mjs';
const uuid='123e4567-e89b-42d3-a456-426614174000';
const sampleFile={id:uuid,name:'cover.jpg',size:1234,type:'image/jpeg',status:'private',revision:'7'};
const sampleLink={code:'Ab12',label:'NL 1',target:'https://paulikreisch.de/shop',active:true,clicks:5,createdAt:'2026-11-16T10:00:00.000Z',campaign:'sommer',revision:'9',url:'https://l.paulikreisch.de/Ab12'};
function fixture({withFiles=true,withLinks=true}={}){
  const calls=[];
  const service=new MarketingService(new MemoryStorage());
  const auth={session:async r=>r.headers.get('cookie')==='fixture=yes'?{email:'local@example.invalid',csrf:'fixture-csrf'}:null,login:async()=>new Response('{}'),logout:async()=>new Response('{}')};
  const files={
    policy:{maxBytes:64,types:['image/png']},
    list:async(actor,cursor)=>{calls.push(['files.list',actor,cursor]);return {records:[sampleFile]}},
    pending:async()=>({pending:[],failedIds:[],incomplete:false}),
    upload:async(actor,file)=>{calls.push(['files.upload',actor,file.name,file.type,file.bytes.byteLength]);return sampleFile},
    setStatus:async(actor,id,revision,action,confirmed)=>{calls.push(['files.setStatus',id,revision,action,confirmed]);return {...sampleFile,status:'published',publicUrl:'https://static.paulikreisch.de/f/'+uuid}},
    remove:async(actor,id,revision,confirmed)=>{calls.push(['files.remove',id,revision,confirmed]);return {blobDeleted:true}},
    retry:async(actor,id)=>{calls.push(['files.retry',id]);return 'completed'},
  };
  const links={
    list:async cursor=>{calls.push(['links.list',cursor]);return {records:[sampleLink]}},
    create:async(fields,format,custom)=>{calls.push(['links.create',fields,format,custom]);return sampleLink},
    update:async(code,revision,fields)=>{calls.push(['links.update',code,revision,fields])},
    setActive:async(code,revision,active)=>{calls.push(['links.setActive',code,revision,active])},
    remove:async(code,revision,confirmed)=>{calls.push(['links.remove',code,revision,confirmed])},
  };
  const handler=createMarketingHandler({service,auth,assets:{'/':{body:'<h1>Fixture</h1>',type:'text/html'}},files:withFiles?files:undefined,links:withLinks?links:undefined});
  return {handler,calls};
}
const request=(path,method='GET',body=null,{host='m.paulikreisch.de',auth=true,origin=true,csrf=true,raw=null}={})=>new Request('https://'+host+path,{method,headers:{...(auth?{cookie:'fixture=yes'}:{}),...(origin?{origin:'https://'+host}:{}),...(csrf?{'x-csrf-token':'fixture-csrf'}:{}),'content-type':raw?raw.type:'application/json'},...(body?{body:JSON.stringify(body)}:raw?{body:raw.bytes}:{})});
test('file and link APIs stay manager-only and hidden without injection',async()=>{
  const {handler}=fixture();
  for(const host of ['lp.paulikreisch.de','ads.paulikreisch.de'])for(const path of ['/api/marketing/files','/api/marketing/links'])assert.equal((await handler(request(path,'GET',null,{host}))).status,404);
  const bare=fixture({withFiles:false,withLinks:false}).handler;
  for(const path of ['/api/marketing/files','/api/marketing/links'])assert.equal((await bare(request(path))).status,404);
});
test('file and link APIs require session and CSRF like the document API',async()=>{
  const {handler,calls}=fixture();
  assert.equal((await handler(request('/api/marketing/files','GET',null,{auth:false}))).status,401);
  assert.equal((await handler(request('/api/marketing/links','GET',null,{auth:false}))).status,401);
  assert.ok([401,403].includes((await handler(request('/api/marketing/links','POST',{label:'x'}, {csrf:false}))).status));
  assert.ok([401,403].includes((await handler(request('/api/marketing/links','POST',{label:'x'}, {origin:false}))).status));
  assert.equal(calls.length,0);
});
test('file library lists, uploads raw bytes with streaming cap and confirms publication',async()=>{
  const {handler,calls}=fixture();
  const list=await(await handler(request('/api/marketing/files'))).json();assert.equal(list.records[0].id,uuid);assert.deepEqual(calls[0],['files.list',{email:'local@example.invalid',verified:true},undefined]);
  const ok=await handler(request('/api/marketing/files?name=cover.jpg','POST',null,{raw:{type:'image/jpeg',bytes:new Uint8Array(10)}}));
  assert.equal(ok.status,201);assert.deepEqual(calls[1],['files.upload',{email:'local@example.invalid',verified:true},'cover.jpg','image/jpeg',10]);
  const big=await handler(request('/api/marketing/files?name=big.jpg','POST',null,{raw:{type:'image/jpeg',bytes:new Uint8Array(65)}}));
  assert.equal(big.status,413);
  const published=await(await handler(request('/api/marketing/files/'+uuid+'/publish','POST',{revision:'7',confirmed:true}))).json();
  assert.equal(published.status,'published');assert.deepEqual(calls.at(-1),['files.setStatus',uuid,'7','publish',true]);
});
test('short links create, update, toggle and delete through the shared facade',async()=>{
  const {handler,calls}=fixture();
  const created=await handler(request('/api/marketing/links','POST',{label:'NL 1',target:'https://paulikreisch.de/shop',campaign:'sommer',format:'random',customCode:''}));
  assert.equal(created.status,201);assert.deepEqual(calls[0],['links.create',{label:'NL 1',target:'https://paulikreisch.de/shop',campaign:'sommer'},'random','']);
  await handler(request('/api/marketing/links/Ab12','PUT',{revision:'9',label:'NL 1b',target:'https://paulikreisch.de/shop',campaign:'sommer-2'}));
  assert.deepEqual(calls[1],['links.update','Ab12','9',{label:'NL 1b',target:'https://paulikreisch.de/shop',campaign:'sommer-2'}]);
  await handler(request('/api/marketing/links/Ab12/active','POST',{revision:'9',active:false}));
  assert.deepEqual(calls[2],['links.setActive','Ab12','9',false]);
  await handler(request('/api/marketing/links/Ab12','DELETE',{revision:'9',confirmed:true}));
  assert.deepEqual(calls[3],['links.remove','Ab12','9',true]);
});
test('facade 4xx status and message surface unchanged, unknown failures stay generic',async()=>{
  const {handler}=fixture({withLinks:true});
  const failing=createMarketingHandler({service:new MarketingService(new MemoryStorage()),auth:{session:async()=>({email:'a@b.c',csrf:'c'})},assets:{},links:{
    list:async()=>{throw Object.assign(new Error('Bitte neu laden.'),{status:409})},
    create:async()=>{throw new Error('internal detail')},
  }});
  const req=(path,method='GET',body=null)=>new Request('https://m.paulikreisch.de'+path,{method,headers:{cookie:'fixture=yes',origin:'https://m.paulikreisch.de','x-csrf-token':'c','content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
  const conflict=await failing(req('/api/marketing/links'));assert.equal(conflict.status,409);assert.equal((await conflict.json()).error,'Bitte neu laden.');
  const failure=await failing(req('/api/marketing/links','POST',{label:'x'}));assert.equal(failure.status,500);assert.equal((await failure.json()).error,'Serverfehler. Bitte später erneut versuchen.');
});

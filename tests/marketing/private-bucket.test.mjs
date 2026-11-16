import test from 'node:test';import assert from 'node:assert/strict';import {PrivateBucketStorage,bucketLoginLimiter} from '../../src/marketing/private-bucket.mjs';import {MarketingService} from '../../src/marketing/service.mjs';
const secret='x'.repeat(64);
function bucket(){const files=new Map();return {files,file(path,{generation}={}){return {name:path,acl:{get:async()=>[[{entity:'project-owners-test'}]]},getMetadata:async()=>{const f=files.get(path);if(!f)throw{code:404};return[{generation:String(f.generation),size:String(f.bytes.length)}];},download:async()=>{const f=files.get(path);if(!f||generation&&String(f.generation)!==String(generation))throw{code:404};return[Buffer.from(f.bytes)];},save:async(bytes,options)=>{const f=files.get(path),current=f?.generation??0;if(String(options.preconditionOpts.ifGenerationMatch)!==String(current))throw{code:412};files.set(path,{bytes:Buffer.from(bytes),generation:current+1});}};}};}
const lp={kind:'lp',name:'Secret local fixture',slug:'fixture',steps:[{slug:'start',title:'Private title',body:'Private body',bullets:[]}]};
test('private adapter encrypts content and survives a new service instance',async()=>{const b=bucket(),s=new MarketingService(new PrivateBucketStorage(b,secret)),r=await s.create(lp,'test');const raw=[...b.files.values()][0].bytes.toString();assert.doesNotMatch(raw,/Secret local fixture|Private title|Private body/);const s2=new MarketingService(new PrivateBucketStorage(b,secret));assert.equal((await s2.get(r.id)).draft.name,lp.name);const wrong=new PrivateBucketStorage(b,'z'.repeat(64));await assert.rejects(()=>wrong.list());});
test('distributed generation writes prevent lost drafts and duplicate slug publication',async()=>{const b=bucket(),a=new MarketingService(new PrivateBucketStorage(b,secret)),c=new MarketingService(new PrivateBucketStorage(b,secret));const[ra,rc]=await Promise.all([a.create(lp,'a'),c.create(lp,'c')]);assert.equal((await a.list()).length,2);const results=await Promise.allSettled([a.publish(ra.id,1,'a'),c.publish(rc.id,1,'c')]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);});
test('distributed login limit survives new adapter instances and resets by window',async()=>{const b=bucket();let now=0;for(let i=0;i<12;i++)assert.equal(await bucketLoginLimiter(b,secret,()=>now)('m.paulikreisch.de'),true);assert.equal(await bucketLoginLimiter(b,secret,()=>now)('m.paulikreisch.de'),false);now=900001;assert.equal(await bucketLoginLimiter(b,secret,()=>now)('m.paulikreisch.de'),true);});

test('fixed 128-bit GCM tags retain PRM1 compatibility and reject tampering',async()=>{
  const {createCipheriv,hkdfSync,randomBytes}=await import('node:crypto');
  const store=new PrivateBucketStorage(bucket(),secret);
  const records=[{id:'legacy',draft:{title:'Existing encrypted record'}}];
  // Produce the pre-fix wire format independently: PRM1, 12-byte IV, 16-byte tag.
  const key=Buffer.from(hkdfSync('sha256',secret,'paulikreisch-marketing-v1','private-state',32));
  const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);
  cipher.setAAD(Buffer.from(store.path));
  const ciphertext=Buffer.concat([cipher.update(JSON.stringify(records),'utf8'),cipher.final()]);
  const legacy=Buffer.concat([Buffer.from('PRM1'),iv,cipher.getAuthTag(),ciphertext]);
  assert.deepEqual(store.decode(legacy),records);
  assert.deepEqual(store.decode(store.encode(records)),records);
  for(const index of [0,4,16,31,32,legacy.length-1]){
    const changed=Buffer.from(legacy);changed[index]^=1;
    assert.throws(()=>store.decode(changed),undefined,`tampering at byte ${index}`);
  }
  for(const length of [0,4,16,28,31,32,legacy.length-1])assert.throws(()=>store.decode(legacy.subarray(0,length)));
  assert.throws(()=>new PrivateBucketStorage(bucket(),secret,'login-limits').decode(legacy));
});

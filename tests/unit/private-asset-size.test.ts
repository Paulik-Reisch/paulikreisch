import test from 'node:test';
import assert from 'node:assert/strict';
import {PROPOSED_UPLOAD_POLICY,validateAssetCandidate} from '../../src/lib/private-asset-model';
import {verifyPrivateAssetContent} from '../../src/lib/private-asset-content';
import fs from 'node:fs';
test('approved limit is exactly ten decimal MB, inclusive',()=>{
 assert.equal(PROPOSED_UPLOAD_POLICY.maxBytes,10_000_000);
 assert.equal(validateAssetCandidate({name:'boundary.txt',size:10_000_000,type:'text/plain'},PROPOSED_UPLOAD_POLICY),null);
 assert.match(validateAssetCandidate({name:'boundary.txt',size:10_000_001,type:'text/plain'},PROPOSED_UPLOAD_POLICY)??'',/10 MB/);
});
test('server text verifier accepts ten MB and rejects one byte more',async()=>{
 const bytes=new Uint8Array(10_000_000).fill(65);
 assert.equal((await verifyPrivateAssetContent(bytes,'text/plain','boundary.txt')).bytes.length,10_000_000);
 await assert.rejects(verifyPrivateAssetContent(new Uint8Array(10_000_001),'text/plain','too-large.txt'),/10 MB/);
});
test('all production storage and transport guards use approved limit',()=>{
 for(const path of ['src/lib/private-pdf-worker.ts','src/lib/private-asset-content.ts','src/lib/private-asset-adapters.ts','src/lib/private-asset-runtime.ts','src/app/admin/upload/actions.ts']){
  const source=fs.readFileSync(path,'utf8');assert.match(source,/10_000_000/,path);assert.doesNotMatch(source,/5\s?\*\s?1024\s?\*\s?1024|5242880/,path);
 }
 assert.match(fs.readFileSync('next.config.ts','utf8'),/bodySizeLimit:'11mb'/);
});

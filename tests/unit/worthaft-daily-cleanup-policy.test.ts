import test from 'node:test';import assert from 'node:assert/strict';
import {runDailyCleanup,type DailyCleanupEntry} from '../../src/lib/worthaft-daily-cleanup-policy';
const row=(id:string):DailyCleanupEntry<number>=>({id,data:{date:id,word:'APFEL',sourceRevision:'r'},version:123});
test('dry run lists old pins without any delete; query bounded before yesterday',async()=>{
 let deletes=0;
 const result=await runDailyCleanup({scanBefore:async(cutoff,limit)=>{assert.equal(cutoff,'2026-11-20');assert.equal(limit,32);return [row('2026-11-19'),row('2026-11-20'),row('2026-11-21'),row('current')]},deleteUnchanged:async()=>{deletes++}},'2026-11-21',true,()=>{throw Error('dry-run does not need clock')});
 assert.deepEqual(result.ids,['2026-11-19']);assert.equal(deletes,0);
});
test('delete preserves versions for preconditions, skips malformed or recent records',async()=>{
 const old=row('2026-11-19');let removed:DailyCleanupEntry<number>[]=[];
 await runDailyCleanup({scanBefore:async()=>[old,row('2026-11-20'),{...row('2026-11-18'),data:null}],deleteUnchanged:async rows=>{removed=rows}},'2026-11-21',false,()=> '2026-11-21');
 assert.deepEqual(removed,[old]);
});
test('clock change fails closed before delete and DB errors propagate',async()=>{
 let calls=0;const store={scanBefore:async()=>[row('2026-11-19')],deleteUnchanged:async()=>{calls++;throw Error('version changed')}};
 await assert.rejects(()=>runDailyCleanup(store,'2026-11-21',false,()=> '2026-11-20'),/date changed/);assert.equal(calls,0);
 await assert.rejects(()=>runDailyCleanup(store,'2026-11-21',false,()=> '2026-11-21'),/version changed/);assert.equal(calls,1);
});

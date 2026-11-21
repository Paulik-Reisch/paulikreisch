import test from 'node:test';import assert from 'node:assert/strict';
import {worthaftOldestRetainedDate,mayDeleteDailyWord} from '../../src/lib/worthaft-daily-retention';
test('calendar retention keeps today and yesterday, including DST/month/year edges',()=>{
 for(const [today,yesterday] of [['2026-11-21','2026-11-20'],['2027-01-01','2026-12-31'],['2026-03-30','2026-03-29'],['2026-10-26','2026-10-25'],['2028-03-01','2028-02-29']])assert.equal(worthaftOldestRetainedDate(today),yesterday);
});
test('only valid matching historical daily records can be deleted',()=>{
 const row=(date:string)=>({date,word:'GRÜẞE',sourceRevision:'test'});
 assert.equal(mayDeleteDailyWord('2026-11-19',row('2026-11-19'),'2026-11-21'),true);
 for(const id of ['2026-11-20','2026-11-21','2026-11-22','current','2026-02-31'])assert.equal(mayDeleteDailyWord(id,row(id),'2026-11-21'),false);
 for(const data of [null,{},row('2026-11-18'),{...row('2026-11-19'),word:'x'},{...row('2026-11-19'),sourceRevision:''}])assert.equal(mayDeleteDailyWord('2026-11-19',data,'2026-11-21'),false);
 assert.throws(()=>worthaftOldestRetainedDate('2026-02-31'));
});

import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('cleanup remains opt-in, fixed-collection, bounded and update-safe',()=>{
 const source=readFileSync('src/lib/worthaft-daily-cleanup.ts','utf8');
 for(const token of ["const COLLECTION = 'worthaft_daily_words_v1'",'dryRun = true','lastUpdateTime: doc.updateTime',"WORTHAFT_DAILY_CLEANUP_RELEASE !== 'calendar-two-days-accepted'"])assert.ok(source.includes(token),token);
 assert.ok(!source.includes('recursiveDelete'));
});

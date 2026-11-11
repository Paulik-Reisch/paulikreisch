import {test} from 'node:test';import assert from 'node:assert/strict';
import {analyticsInput} from '../../src/lib/analytics-input';
const id='visitor:12345678-1234-1234-1234-123456789abc';
test('analytics accepts only pseudonymous visitor IDs and known event types',()=>{assert.equal(analyticsInput('page_view','firebase-uid','/',{}),null);assert.equal(analyticsInput('arbitrary',id,'/',{}),null);assert.equal(analyticsInput('page_view',id,'/',{})?.userId,id)});
test('analytics removes query strings, fragments and private or unbounded fields',()=>{const e=analyticsInput('page_view',id,'/nl/unsubscribe?email=x@y.z#secret',{email:'x@y.z',freeText:'private',source:'footer',userAgent:'x'.repeat(301),reason:'a@b.de'});assert.equal(e?.path,'/nl/unsubscribe');assert.deepEqual(e?.params,{source:'footer'})});

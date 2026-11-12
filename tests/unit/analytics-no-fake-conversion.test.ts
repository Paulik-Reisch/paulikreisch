import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('dashboard never renders placeholder conversion as measured purchases',()=>{
 const source=readFileSync('src/app/admin/analytics/analytics-client.tsx','utf8');
 assert.equal(source.includes('summary.conversionRate.value.toFixed'),false);
 assert.ok(source.includes('Keine bestätigten Kaufdaten vorhanden'));
 assert.ok(source.includes('Nicht erfasst'));
});

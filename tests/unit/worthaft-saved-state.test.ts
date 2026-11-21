import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWorthaftDailyGame, parseWorthaftStats, worthaftStorage } from '../../src/lib/worthaft-saved-state';
const valid = { date: '2026-11-21', guesses: [{ guess: 'GRÜẞE', statuses: ['correct','absent','present','absent','correct'] }], status: 'playing', letterStatuses: { 'ẞ': 'present' }, rowTimes: [1200] };
test('malformed statistics do not become renderable values', () => {
  for (const raw of ['not-json','null','[]','"text"','{"games":{}}','{"wins":-1}','{"streak":1.5}']) assert.equal(parseWorthaftStats(raw), null);
  assert.deepEqual(parseWorthaftStats('{"games":9,"wins":7}'), {games:9,wins:7,streak:0,maxStreak:0});
});
test('valid current and legacy game records survive without mutation', () => {
  assert.deepEqual(parseWorthaftDailyGame(JSON.stringify(valid)), {...valid,hotTip:undefined});
  const legacy = {...valid, letterStatuses:undefined,rowTimes:undefined,jokerPosition:{guessIndex:0,letterIndex:4}};
  const parsed = parseWorthaftDailyGame(JSON.stringify(legacy));
  assert.deepEqual(parsed?.jokerPosition, legacy.jokerPosition); assert.deepEqual(parsed?.letterStatuses,{});
});
test('bad optional or nested fields cannot crash the grid or statistics', () => {
  for (const patch of [{guesses:null},{guesses:[null]},{guesses:[{guess:'APFEL',statuses:null}]},{guesses:[{guess:'APFEL',statuses:['correct']}]},{status:{}},{letterStatuses:[]},{letterStatuses:{A:{}}},{rowTimes:[{}]},{hotTip:{letter:{},attempt:1}},{jokerPosition:{guessIndex:0,letterIndex:100}}]) {
    assert.equal(parseWorthaftDailyGame(JSON.stringify({...valid,...patch})),null);
  }
});
test('storage adapter tolerates missing or unavailable browser storage', () => {
  assert.equal(worthaftStorage.getItem('test'),null);
  assert.doesNotThrow(()=>worthaftStorage.setItem('test','value'));
  assert.doesNotThrow(()=>worthaftStorage.removeItem('test'));
});

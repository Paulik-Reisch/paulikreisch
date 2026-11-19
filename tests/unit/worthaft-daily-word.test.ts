import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getWorthaftDateString,
  getWorthaftMillisecondsUntilNextDay,
  getWorthaftWordOfTheDay,
} from '../../src/lib/worthaft-daily-word';

test('uses the same Berlin day for timestamps in different time zones', () => {
  assert.equal(getWorthaftDateString(new Date('2026-03-28T22:30:00.000Z')), '2026-03-28');
  assert.equal(getWorthaftDateString(new Date('2026-03-28T23:30:00.000Z')), '2026-03-29');
});

test('counts down to Berlin midnight across the daylight-saving transition', () => {
  const now = new Date('2026-03-28T22:59:30.000Z');
  const milliseconds = getWorthaftMillisecondsUntilNextDay(now);

  assert.equal(milliseconds, 30_000);
  assert.equal(getWorthaftDateString(new Date(now.getTime() + milliseconds)), '2026-03-29');
});

test('counts down to Berlin midnight when daylight-saving time ends', () => {
  const now = new Date('2026-10-24T21:59:30.000Z');
  const milliseconds = getWorthaftMillisecondsUntilNextDay(now);

  assert.equal(milliseconds, 30_000);
  assert.equal(getWorthaftDateString(new Date(now.getTime() + milliseconds)), '2026-10-25');
});

test('selects one deterministic word for a Berlin calendar date', () => {
  const words = ['birne', 'fähre', 'worte'];

  assert.equal(getWorthaftWordOfTheDay(words, '2024-01-01'), 'BIRNE');
  assert.equal(getWorthaftWordOfTheDay(words, '2024-01-02'), 'FÄHRE');
  assert.equal(getWorthaftWordOfTheDay(words, '2024-01-02'), 'FÄHRE');
});

test('sharp s stays one letter so daily feedback passes five-letter rules', () => {
  assert.equal(getWorthaftWordOfTheDay(['büßer'], '2026-11-19'), 'BÜẞER');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorthaftKeyDimensions, normalizeWorthaftSliderValue } from '../../src/lib/worthaft-settings';

test('normalizes legacy Worthaft slider values to the 0–4 scale', () => {
  assert.deepEqual([0, 25, 50, 75, 100].map(normalizeWorthaftSliderValue), [0, 1, 2, 3, 4]);
});

test('keeps normalized Worthaft slider values unchanged', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(normalizeWorthaftSliderValue), [0, 1, 2, 3, 4]);
});

test('uses the default for invalid Worthaft slider values and clamps out-of-range values', () => {
  assert.equal(normalizeWorthaftSliderValue(Number.NaN), 2);
  assert.equal(normalizeWorthaftSliderValue('50'), 2);
  assert.equal(normalizeWorthaftSliderValue(-25), 0);
  assert.equal(normalizeWorthaftSliderValue(200), 4);
});

test('uses square Worthaft key dimensions when width and height settings match', () => {
  for (const setting of [0, 1, 2, 3, 4]) {
    const dimensions = getWorthaftKeyDimensions(setting, setting);
    assert.equal(dimensions.width, dimensions.height);
  }
});

test('keeps Worthaft key width and height independently adjustable', () => {
  assert.deepEqual(getWorthaftKeyDimensions(0, 4), { width: 26, height: 50 });
});

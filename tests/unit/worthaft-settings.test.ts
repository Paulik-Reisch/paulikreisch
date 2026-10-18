import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorthaftKeyDimensions, normalizeWorthaftSliderValue, normalizeWorthaftSettings, DEFAULT_WORTHAFT_SETTINGS, getWorthaftTileDimensions, getWorthaftStatusClass } from '../../src/lib/worthaft-settings';

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


test('validates all persisted settings and ignores unexpected properties', () => {
  assert.deepEqual(normalizeWorthaftSettings(null), DEFAULT_WORTHAFT_SETTINGS);
  assert.deepEqual(normalizeWorthaftSettings([]), DEFAULT_WORTHAFT_SETTINGS);
  const result = normalizeWorthaftSettings({ keyRadius: 75, tileRadius: 100, tileWidth: -1, tileHeight: 999, palette: 'classic', musicEnabled: 'true', hotTipEnabled: false, unexpected: 'ignored' });
  assert.equal(result.keyRadius, 3);
  assert.equal(result.tileRadius, 4);
  assert.equal(result.tileWidth, 0);
  assert.equal(result.tileHeight, 4);
  assert.equal(result.palette, 'classic');
  assert.equal(result.musicEnabled, false);
  assert.equal(result.hotTipEnabled, false);
  assert.equal('unexpected' in result, false);
});

test('migrates old settings without linking keyboard and tile rounding', () => {
  const result = normalizeWorthaftSettings({ keyWidth: 50, keyRadius: 100, animationsEnabled: false });
  assert.equal(result.keyWidth, 2);
  assert.equal(result.keyRadius, 4);
  assert.equal(result.tileRadius, 0);
  assert.equal(result.animationsEnabled, false);
  assert.equal(result.palette, 'original');
  assert.equal(normalizeWorthaftSettings({ palette: 'invalid' }).palette, 'original');
});

test('tile width and height are independent and palettes share yellow and gray', () => {
  assert.deepEqual(getWorthaftTileDimensions(0, 4), { width: 40, height: 72 });
  assert.notEqual(getWorthaftStatusClass('correct', 'classic'), getWorthaftStatusClass('correct', 'original'));
  for (const status of ['present', 'absent']) assert.equal(getWorthaftStatusClass(status, 'classic'), getWorthaftStatusClass(status, 'original'));
});

test('small keyboard labels retain accessible contrast in both palettes', () => {
  const luminance = (hex: string) => {
    const channels = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
      .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  for (const palette of ['original', 'classic'] as const) {
    for (const status of ['correct', 'absent']) {
      const classes = getWorthaftStatusClass(status, palette);
      const color = classes.match(/bg-\[#([a-f0-9]{6})\]/)?.[1];
      assert.ok(color);
      assert.ok(1.05 / (luminance(color) + 0.05) >= 4.5, `${palette} ${status} should contrast with white text`);
    }
  }
});

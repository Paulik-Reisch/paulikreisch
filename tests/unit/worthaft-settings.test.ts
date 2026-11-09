import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_WORTHAFT_SETTINGS, normalizeWorthaftSettings } from '../../src/lib/worthaft-settings';

test('uses the requested appearance defaults from the reference screenshots', () => {
  assert.deepEqual({
    keyWidth: DEFAULT_WORTHAFT_SETTINGS.keyWidth,
    keyHeight: DEFAULT_WORTHAFT_SETTINGS.keyHeight,
    keySize: DEFAULT_WORTHAFT_SETTINGS.keySize,
    keyRadius: DEFAULT_WORTHAFT_SETTINGS.keyRadius,
    tileWidth: DEFAULT_WORTHAFT_SETTINGS.tileWidth,
    tileHeight: DEFAULT_WORTHAFT_SETTINGS.tileHeight,
    tileRadius: DEFAULT_WORTHAFT_SETTINGS.tileRadius,
    palette: DEFAULT_WORTHAFT_SETTINGS.palette,
  }, {
    keyWidth: 4,
    keyHeight: 2,
    keySize: 2,
    keyRadius: 1,
    tileWidth: 1,
    tileHeight: 1,
    tileRadius: 1,
    palette: 'original',
  });
});

test('fills missing appearance values with the new defaults', () => {
  const settings = normalizeWorthaftSettings({ hotTipEnabled: false });

  assert.equal(settings.keyWidth, 4);
  assert.equal(settings.keyHeight, 2);
  assert.equal(settings.keySize, 2);
  assert.equal(settings.keyRadius, 1);
  assert.equal(settings.tileWidth, 1);
  assert.equal(settings.tileHeight, 1);
  assert.equal(settings.tileRadius, 1);
  assert.equal(settings.hotTipEnabled, false);
});

test('keeps saved appearance levels instead of replacing them with defaults', () => {
  const settings = normalizeWorthaftSettings({
    keyWidth: 0,
    keyHeight: 1,
    keySize: 3,
    keyRadius: 4,
    tileWidth: 2,
    tileHeight: 3,
    tileRadius: 0,
  });

  assert.deepEqual({
    keyWidth: settings.keyWidth,
    keyHeight: settings.keyHeight,
    keySize: settings.keySize,
    keyRadius: settings.keyRadius,
    tileWidth: settings.tileWidth,
    tileHeight: settings.tileHeight,
    tileRadius: settings.tileRadius,
  }, {
    keyWidth: 0,
    keyHeight: 1,
    keySize: 3,
    keyRadius: 4,
    tileWidth: 2,
    tileHeight: 3,
    tileRadius: 0,
  });
});

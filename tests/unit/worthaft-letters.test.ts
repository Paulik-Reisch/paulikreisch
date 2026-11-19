import test from 'node:test';
import assert from 'node:assert/strict';
import { getWorthaftKeyboardLetter, uppercaseWorthaftWord } from '../../src/lib/worthaft-letters';

test('physical lowercase sharp s produces one capital tile, not SS', () => {
  assert.equal(getWorthaftKeyboardLetter('ß'), 'ẞ');
});
test('physical capital sharp s is accepted just like the on-screen key', () => {
  assert.equal(getWorthaftKeyboardLetter('ẞ'), 'ẞ');
});
test('umlaut key uses one normalized capital letter', () => {
  assert.equal(getWorthaftKeyboardLetter('u\u0308'), 'Ü');
});
test('ASCII keyboard input is capitalized', () => {
  assert.equal(getWorthaftKeyboardLetter('b'), 'B');
});
test('multiple letters cannot occupy one tile', () => {
  assert.equal(getWorthaftKeyboardLetter('SS'), null);
});
test('control keys do not become letters', () => {
  assert.equal(getWorthaftKeyboardLetter('Enter'), null);
});
test('punctuation does not become a letter', () => {
  assert.equal(getWorthaftKeyboardLetter('!'), null);
});
test('daily words retain sharp s as one letter for feedback storage', () => {
  assert.equal(uppercaseWorthaftWord('büßer'), 'BÜẞER');
});
test('real double s is not silently rewritten to sharp s', () => {
  assert.equal(uppercaseWorthaftWord('büsser'), 'BÜSSER');
});

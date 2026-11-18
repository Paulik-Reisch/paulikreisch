import test from 'node:test';
import assert from 'node:assert/strict';
import {confirmMessage} from '../../src/newsletter/doi.mjs';

test('confirmation mail is branded HTML with a plain-text twin and escapes the link', () => {
  const url = 'https://paulikreisch.de/nl/confirm?t=a%26b.c"d';
  const m = confirmMessage({from: 'x', email: 'r@example.com', url});
  assert.deepEqual(m.to, ['r@example.com']);
  assert.equal(m.subject, 'Bitte bestätige deine Newsletter-Anmeldung');
  assert.match(m.html, /https:\/\/paulikreisch\.de\/logo\.png/);
  assert.match(m.html, /Anmeldung bestätigen/);
  assert.match(m.html, /ca\. einmal pro Woche/);
  assert.doesNotMatch(m.html, /c"d/);
  assert.doesNotMatch(m.html, /<script|<style/i);
  assert.ok(m.text.includes(url) && /jederzeit abmelden/.test(m.text));
});

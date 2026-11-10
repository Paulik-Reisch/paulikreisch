import test from 'node:test';
import assert from 'node:assert/strict';
import { pickLegalPage } from '../../src/lib/legal-page-lookup';
import type { LegalPage } from '../../src/lib/firestore';

const page = (id: string): LegalPage => ({
  id, title: id, content: `<p>${id}</p>`, components: [], lastUpdated: '2026-01-01T00:00:00.000Z', showTitle: true, showDate: true,
});

test('returns the stored page when it is in the list', () => {
  let fallbackCalls = 0;
  const result = pickLegalPage([page('impressum'), page('agb')], 'agb', () => { fallbackCalls++; return null; });
  assert.equal(result?.id, 'agb');
  assert.equal(fallbackCalls, 0);
});

test('uses the fallback for a slug missing from the list', () => {
  const fb = page('datenschutz');
  assert.equal(pickLegalPage([page('agb')], 'datenschutz', () => fb), fb);
});

test('returns null for an unknown slug without a fallback', () => {
  assert.equal(pickLegalPage([page('agb')], 'wp-login.php', () => null), null);
});

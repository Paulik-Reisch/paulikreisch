import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCampaignUrl, normalizeCampaignValue } from '../../src/lib/campaign-url';

test('builds a campaign URL with encoded, lowercase utm parameters', () => {
  const result = buildCampaignUrl({
    baseUrl: 'https://paulikreisch.de/shop',
    source: 'instagram',
    medium: 'social',
    campaign: 'Buchstart_2026_11',
    content: 'Bio',
  });
  assert.equal(result.ok, true);
  if (result.ok) {
    const url = new URL(result.url);
    assert.equal(url.searchParams.get('utm_source'), 'instagram');
    assert.equal(url.searchParams.get('utm_medium'), 'social');
    assert.equal(url.searchParams.get('utm_campaign'), 'buchstart_2026_11');
    assert.equal(url.searchParams.get('utm_content'), 'bio');
  }
});

test('keeps existing non-utm query parameters of the target url', () => {
  const result = buildCampaignUrl({
    baseUrl: 'https://paulikreisch.de/shop?farbe=rot',
    source: 'newsletter',
    medium: 'email',
    campaign: 'buchstart_2026_11',
  });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(new URL(result.url).searchParams.get('farbe'), 'rot');
});

test('refuses to overwrite existing utm tags silently', () => {
  const result = buildCampaignUrl({
    baseUrl: 'https://paulikreisch.de/shop?utm_campaign=alt',
    source: 'qr',
    medium: 'print',
    campaign: 'neu',
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /utm_campaign/);
});

test('rejects invalid base urls and non-http protocols', () => {
  assert.equal(buildCampaignUrl({ baseUrl: 'keine-url', source: 'qr', medium: 'print', campaign: 'x' }).ok, false);
  assert.equal(buildCampaignUrl({ baseUrl: 'ftp://paulikreisch.de/x', source: 'qr', medium: 'print', campaign: 'x' }).ok, false);
});

test('rejects unknown fixed-vocabulary values', () => {
  assert.equal(buildCampaignUrl({ baseUrl: 'https://paulikreisch.de', source: 'taeterda', medium: 'social', campaign: 'x' }).ok, false);
  assert.equal(buildCampaignUrl({ baseUrl: 'https://paulikreisch.de', source: 'qr', medium: 'rauchzeichen', campaign: 'x' }).ok, false);
});

test('blocks emails, names and tokens in campaign values', () => {
  const bad = ['max@example.com', 'Max Reisch', 'token abc123', ''];
  for (const campaign of bad) {
    assert.equal(
      buildCampaignUrl({ baseUrl: 'https://paulikreisch.de', source: 'qr', medium: 'print', campaign }).ok,
      false,
      `campaign "${campaign}" must be rejected`,
    );
  }
});

test('content is optional and validated the same way', () => {
  const without = buildCampaignUrl({ baseUrl: 'https://paulikreisch.de', source: 'whatsapp', medium: 'messenger', campaign: 'buchstart_2026_11' });
  assert.equal(without.ok, true);
  if (without.ok) assert.equal(new URL(without.url).searchParams.has('utm_content'), false);
  assert.equal(
    buildCampaignUrl({ baseUrl: 'https://paulikreisch.de', source: 'whatsapp', medium: 'messenger', campaign: 'buchstart_2026_11', content: 'a@b.de' }).ok,
    false,
  );
});

test('normalizeCampaignValue trims and lowercases', () => {
  assert.equal(normalizeCampaignValue('  BuchStart_2026  '), 'buchstart_2026');
});

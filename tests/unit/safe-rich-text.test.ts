import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SafeRichText } from '../../src/components/security/safe-rich-text';
import { serializeJsonLd } from '../../src/lib/serialize-json-ld';

test('author rich text strips executable elements, handlers and javascript URLs', () => {
  const html = '<p onclick="alert(1)">Bio<script>alert(1)</script><svg onload="alert(1)"></svg><a href="javascript:alert(1)">Link</a><iframe src="https://evil.example"></iframe></p>';
  const result = renderToStaticMarkup(createElement(SafeRichText, { html }));
  assert.doesNotMatch(result, /<script|<svg|<iframe|onclick|onload|javascript:/i);
  assert.match(result, /Bio/);
  assert.match(result, /Link/);
});

test('author rich text preserves editorial formatting and safe links', () => {
  const html = '<p><strong>Autor</strong> &amp; <em>Satire</em> <a href="https://example.com">Mehr</a></p>';
  const result = renderToStaticMarkup(createElement(SafeRichText, { html, className: 'prose' }));
  assert.match(result, /<strong>Autor<\/strong>/);
  assert.match(result, /<em>Satire<\/em>/);
  assert.match(result, /href="https:\/\/example.com"/);
});

test('JSON-LD cannot break out of its script element and round-trips unchanged', () => {
  const input = { name: '</ScRiPt><script>alert(1)</script>', description: '<!-- & <b>Text</b>' };
  const serialized = serializeJsonLd(input);
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), input);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { renderGptMarkdown } from '../../src/lib/gpt-markdown';

test('renders Markdown emphasis, tables, lists and code blocks', () => {
  const html = renderGptMarkdown('**Wichtig** und *trocken*\n\n| Amt | Ergebnis |\n| --- | --- |\n| Formular | fehlt |\n\n- erster Punkt\n- zweiter Punkt\n\n```ts\nconst formular = true;\n```');
  assert.match(html, /<strong>Wichtig<\/strong>/);
  assert.match(html, /<em>trocken<\/em>/);
  assert.match(html, /<table>/);
  assert.match(html, /<td>Amt<\/td>|<td>Formular<\/td>/);
  assert.match(html, /<ul>/);
  assert.match(html, /<pre><code/);
});

test('removes executable HTML and unsafe link protocols from model output', () => {
  const html = renderGptMarkdown('<img src=x onerror="alert(1)"><script>alert(1)</script> [hier klicken](javascript:alert(1))');
  assert.doesNotMatch(html, /<script|<img|onerror|javascript:/i);
  assert.match(html, /hier klicken/);
});

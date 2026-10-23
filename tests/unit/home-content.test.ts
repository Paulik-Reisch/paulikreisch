import test from 'node:test';
import ts from 'typescript';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homeFaqs, homePeople } from '../../src/lib/home-content';

test('all linked author profiles exist as real routes', () => {
  for (const person of homePeople) assert.ok(existsSync(`src/app${person.href}/page.tsx`), person.href);
});
test('FAQ entries are unique and contain complete answers', () => {
  assert.equal(new Set(homeFaqs.map(item => item.question)).size, homeFaqs.length);
  for (const item of homeFaqs) assert.ok(item.answer.length > 60);
});
test('source archive is byte-equivalent after newline normalization', () => {
  const baseline = JSON.parse(readFileSync('docs/archive/index-old/baseline.json', 'utf8'));
  for (const file of Object.keys(baseline.normalizedFiles)) {
    assert.equal(createHash('sha256').update(readFileSync(file, 'utf8').replace(/\r\n/g, '\n')).digest('hex'), baseline.normalizedFiles[file], `${file} must remain unchanged`);
  }
});
test('robots sitemap is a valid standalone URL', () => {
  const line = readFileSync('public/robots.txt','utf8').split('\n').find(line => line.startsWith('Sitemap:'));
  assert.equal(line?.trim(), 'Sitemap: https://paulikreisch.de/sitemap.xml');
});

test('header and footer emit unchanged JavaScript after equivalent JSX escaping', () => {
  const baseline = JSON.parse(readFileSync('docs/archive/index-old/baseline.json', 'utf8'));
  for (const [file, expected] of Object.entries(baseline.compiledFiles)) {
    const compiled = ts.transpileModule(readFileSync(file, 'utf8').replace(/\r\n/g, '\n'), {
      fileName: file,
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    assert.equal(createHash('sha256').update(compiled).digest('hex'), expected, file);
  }
});

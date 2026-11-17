import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { publishedNewsletterHtml } from '../../src/lib/newsletter-visibility';
const source = (path: string) => readFileSync(path, 'utf8');

test('public newsletter preview requires explicit publication, never truthy flags or missing state', () => {
  for (const isLive of [undefined, null, false, 'true', 1, {}]) {
    assert.equal(publishedNewsletterHtml({ isLive, content: '<p>private</p>' }), null);
  }
  assert.equal(publishedNewsletterHtml(undefined), null);
  assert.equal(publishedNewsletterHtml({ isLive: true, content: '' }), null);
  assert.equal(publishedNewsletterHtml({ isLive: true, content: 5 }), null);
  assert.equal(publishedNewsletterHtml({ isLive: true, content: '<p>published</p>' }), '<p>published</p>');
});

test('Firestore public allowlist has no catch-all and never reopens subscriber creation', () => {
  const code = source('firestore.rules');
  const publicCollections = [...code.matchAll(/match \/([a-z_-]+)\/\{id\} \{\s*allow read: if true;/g)].map(m => m[1]);
  assert.deepEqual(publicCollections, ['authors', 'excerpts', 'legal', 'landing_pages', 'palabrotas', 'chistes', 'seo_metadata', 'worthaft-words', 'worthaft-anti-words']);
  assert.doesNotMatch(code, /match \/\{collection\}|match \/subscribers\//);
  assert.match(code, /match \/\{document=\*\*\} \{\s*allow read, write: if isAuthorizedAdmin\(\);/);
  assert.match(code, /email_verified == true/);
});

test('private feedback read checks session before Admin SDK and no longer reads in browser', () => {
  const code = source('src/app/admin/feedback/actions.ts');
  assert.ok(code.indexOf('if (!await getSession())') < code.indexOf('getAdminDb().collection'));
  const page = source('src/app/admin/feedback/page.tsx');
  assert.doesNotMatch(page, /initializeFirebase|getDocs\(|firebase\/firestore/);
  assert.match(page, /await loadAdminFeedback\(\)/);
});

test('legacy public preview uses server publication gate and private preview stays session-bound and sandboxed', () => {
  const publicPage = source('src/app/nl/preview/[slug]/page.tsx');
  assert.match(publicPage, /getPublishedNewsletterHtml/);
  assert.doesNotMatch(publicPage, /getNewsletter\(/);
  assert.match(source('src/lib/newsletter-preview.ts'), /import 'server-only'/);
  assert.match(source('src/lib/newsletter-preview.ts'), /publishedNewsletterHtml\(snapshot.data\(\)\)/);
  const privatePage = source('src/app/admin/nle/[slug]/preview/page.tsx');
  assert.ok(privatePage.indexOf('if (!await getSession())') < privatePage.indexOf('await getNewsletterAdmin'));
  assert.match(privatePage, /sandbox=""/);
  const admin = source('src/lib/admin-writes.ts').split('export async function getNewsletterAdmin')[1].split('export async function addNewsletter')[0];
  assert.ok(admin.indexOf('if (!await getSession())') < admin.indexOf('getAdminDb().collection'));
  assert.match(source('src/components/admin/actions.ts'), /await getNewsletterAdmin\(newsletterId\)/);
});

test('obsolete analytics entry redirects without invoking unguarded private loaders', () => {
  const code = source('src/app/admin/analytics/page.tsx');
  assert.match(code, /redirect\(ANALYTICS_ORIGIN/);
  assert.doesNotMatch(code, /getRecentEvents|getAnalyticsDashboard/);
});

// Execute the real server modules with only framework/database boundaries replaced.
// No production credentials or records are used.
import ts from 'typescript';
import { runInNewContext } from 'node:vm';
function serverModule(path: string, dependencies: Record<string, unknown>) {
  const module = { exports: {} as Record<string, any> };
  const compiled = ts.transpileModule(source(path), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(compiled, { module, exports: module.exports, require: (name: string) => {
    if (name === 'server-only') return {};
    if (name in dependencies) return dependencies[name];
    throw new Error(`Unexpected dependency: ${name}`);
  }});
  return module.exports;
}

test('signed-out historical newsletter read rejects before touching the database', async () => {
  let reads = 0;
  const server = serverModule('src/lib/admin-writes.ts', {
    './session': { getSession: async () => null },
    'firebase-admin/firestore': {},
    '@/lib/firebase-admin': { getAdminDb: () => { reads++; throw new Error('Database must stay untouched'); } },
  });
  await assert.rejects(server.getNewsletterAdmin('draft-id'), /Nicht authentifiziert/);
  assert.equal(reads, 0);
});

test('signed-out feedback action rejects before touching the database', async () => {
  let reads = 0;
  const server = serverModule('src/app/admin/feedback/actions.ts', {
    '@/lib/session': { getSession: async () => null },
    '@/lib/firebase-admin': { getAdminDb: () => { reads++; throw new Error('Database must stay untouched'); } },
  });
  await assert.rejects(server.loadAdminFeedback(), /Nicht authentifiziert/);
  assert.equal(reads, 0);
});

test('public historical loader returns published HTML but no draft or missing record', async () => {
  const records: Record<string, unknown> = {
    draft: { isLive: false, content: '<p>secret draft</p>' },
    published: { isLive: true, content: '<p>public issue</p>', recipients: ['private@example.invalid'] },
  };
  let reads = 0;
  const server = serverModule('src/lib/newsletter-preview.ts', {
    './newsletter-visibility': { publishedNewsletterHtml },
    './firebase-admin': { getAdminDb: () => ({ collection: (name: string) => {
      assert.equal(name, 'newsletters');
      return { doc: (id: string) => ({ get: async () => {
        reads++;
        return { exists: id in records, data: () => records[id] };
      } }) };
    } }) },
  });
  assert.equal(await server.getPublishedNewsletterHtml('draft'), null);
  assert.equal(await server.getPublishedNewsletterHtml('missing'), null);
  assert.equal(await server.getPublishedNewsletterHtml('published'), '<p>public issue</p>');
  assert.equal(await server.getPublishedNewsletterHtml('bad/path'), null);
  assert.equal(reads, 3);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  FIRESTORE_READS_LOG_MESSAGE,
  billedReadCount,
  recordFirestoreReads,
} from '../../src/lib/firestore-read-metering';

test('an empty result is billed as one read, other results by document count', () => {
  assert.equal(billedReadCount(0), 1);
  assert.equal(billedReadCount(1), 1);
  assert.equal(billedReadCount(250), 250);
});

test('a metered read writes one JSON line with only the label and the count', () => {
  const lines: string[] = [];
  recordFirestoreReads('getLegalPage', 1, line => lines.push(line), true);
  assert.equal(lines.length, 1);
  assert.deepEqual(JSON.parse(lines[0]), {
    severity: 'INFO',
    message: FIRESTORE_READS_LOG_MESSAGE,
    source: 'getLegalPage',
    documents: 1,
  });
});

test('browser reads are not logged', () => {
  const lines: string[] = [];
  recordFirestoreReads('getLegalPage', 1, line => lines.push(line), false);
  assert.deepEqual(lines, []);
});

test('data-access code reads Firestore only through the metered helpers', () => {
  for (const file of ['src/lib/firestore.ts', 'src/lib/worthaft-word-lists.ts']) {
    const source = readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /\bgetDocs?\(/, `${file} calls getDoc/getDocs directly`);
  }
});

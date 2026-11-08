import test from 'node:test';
import assert from 'node:assert/strict';
import { parsePublishedExcerpts } from '../../src/lib/published-excerpts';

const excerptDocument = (
  slug: string,
  chapterNumber: number,
  isPublished: boolean,
) => ({
  name: `projects/test/databases/(default)/documents/excerpts/${slug}`,
  fields: {
    slug: { stringValue: slug },
    title: { stringValue: `Kapitel ${chapterNumber}` },
    chapterNumber: { integerValue: String(chapterNumber) },
    isPublished: { booleanValue: isPublished },
    content: { stringValue: `<p>Text aus Kapitel ${chapterNumber}</p>` },
  },
});

test('returns only published excerpts in chapter order', () => {
  assert.deepEqual(
    parsePublishedExcerpts([
      excerptDocument('kapitel-3', 3, true),
      excerptDocument('kapitel-2', 2, false),
      excerptDocument('kapitel-1', 1, true),
    ]),
    [
      { id: 'kapitel-1', title: 'Kapitel 1', chapterNumber: 1, content: '<p>Text aus Kapitel 1</p>' },
      { id: 'kapitel-3', title: 'Kapitel 3', chapterNumber: 3, content: '<p>Text aus Kapitel 3</p>' },
    ],
  );
});

test('rejects malformed published excerpts instead of displaying incomplete data', () => {
  const invalidExcerpt = excerptDocument('kapitel-1', 1, true);
  invalidExcerpt.fields.content.stringValue = '';

  assert.throws(() => parsePublishedExcerpts([invalidExcerpt]), /incomplete published excerpt/);
  assert.throws(() => parsePublishedExcerpts({ documents: [] }), /invalid excerpts collection/);
});

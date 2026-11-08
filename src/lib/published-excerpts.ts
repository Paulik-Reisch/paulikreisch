export type PublishedExcerpt = {
  id: string;
  title: string;
  chapterNumber: number;
  content: string;
};

type FirestoreExcerptDocument = {
  name?: unknown;
  fields?: {
    title?: { stringValue?: unknown };
    slug?: { stringValue?: unknown };
    chapterNumber?: { integerValue?: unknown };
    isPublished?: { booleanValue?: unknown };
    content?: { stringValue?: unknown };
  };
};

export function parsePublishedExcerpts(value: unknown): PublishedExcerpt[] {
  if (!Array.isArray(value)) {
    throw new Error('Firestore returned an invalid excerpts collection.');
  }

  return value
    .filter((document): document is FirestoreExcerptDocument => {
      if (typeof document !== 'object' || document === null || !('fields' in document)) {
        throw new Error('Firestore returned an invalid excerpt document.');
      }

      const fields = document.fields;
      if (typeof fields !== 'object' || fields === null) {
        throw new Error('Firestore returned an invalid excerpt document.');
      }

      return fields.isPublished?.booleanValue === true;
    })
    .map((document) => {
      const fields = document.fields;
      const title = fields?.title?.stringValue;
      const slug = fields?.slug?.stringValue;
      const chapterNumberValue = fields?.chapterNumber?.integerValue;
      const content = fields?.content?.stringValue;
      const chapterNumber = typeof chapterNumberValue === 'string' ? Number(chapterNumberValue) : NaN;

      if (
        typeof title !== 'string' ||
        typeof slug !== 'string' ||
        !Number.isInteger(chapterNumber) ||
        typeof content !== 'string' ||
        !content.trim()
      ) {
        throw new Error('Firestore returned an incomplete published excerpt.');
      }

      return { id: slug, title, chapterNumber, content };
    })
    .sort((left, right) => left.chapterNumber - right.chapterNumber);
}

import 'server-only';

import { firebaseConfig } from '@/firebase/config';
import { parsePublishedExcerpts } from './published-excerpts';

export async function getPublishedExcerpts() {
  const collectionUrl = new URL(
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/excerpts`,
  );
  collectionUrl.searchParams.set('key', firebaseConfig.apiKey);
  collectionUrl.searchParams.set('pageSize', '100');

  const response = await fetch(collectionUrl, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error(`Firestore returned HTTP ${response.status} for published excerpts.`);
  }

  const collection = (await response.json()) as { documents?: unknown };
  return parsePublishedExcerpts(collection.documents ?? []);
}

import {
  getDoc,
  getDocs,
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  type Query,
  type QuerySnapshot,
} from 'firebase/firestore';

/**
 * Server-side Firestore read metering.
 *
 * Every metered read writes one structured JSON line to stdout. Cloud Run
 * forwards it to Cloud Logging as `jsonPayload`, so read calls can be compared by
 * the code path that issued them with a logs query, for example
 * `jsonPayload.message="firestore_reads"`. No extra Google Cloud product,
 * write or network call is involved.
 *
 * Only a static label (the data-access function name) and a document count are
 * logged. Paths, slugs, document ids and document contents are never logged.
 *
 * The count is the number of documents the SDK returned, not a billing figure:
 * SDK cache hits, failed calls and index-entry charges are not modeled.
 *
 * Coverage: reads issued in the Node.js server runtime through the helpers
 * below. Browser reads (client SDK in the visitor's browser, including
 * `onSnapshot` listeners) are not metered here.
 */

export const FIRESTORE_READS_LOG_MESSAGE = 'firestore_reads';

export type ReadMeterWriter = (line: string) => void;

/** Documents counted for one call: the result size, or 1 for an empty result. */
export function countedReads(documentsReturned: number): number {
  return Math.max(1, documentsReturned);
}

export function isServerRuntime(): boolean {
  return typeof window === 'undefined';
}

export function recordFirestoreReads(
  source: string,
  documentsReturned: number,
  write: ReadMeterWriter = console.log,
  enabled: boolean = isServerRuntime(),
): void {
  if (!enabled) return;
  write(
    JSON.stringify({
      severity: 'INFO',
      message: FIRESTORE_READS_LOG_MESSAGE,
      source,
      documents: countedReads(documentsReturned),
    }),
  );
}

/** `getDoc` that records one read under `source`. */
export async function getDocMetered<T = DocumentData>(
  source: string,
  reference: DocumentReference<T>,
): Promise<DocumentSnapshot<T>> {
  const snapshot = await getDoc(reference);
  recordFirestoreReads(source, 1);
  return snapshot;
}

/** `getDocs` that records the result size under `source`. */
export async function getDocsMetered<T = DocumentData>(
  source: string,
  query: Query<T>,
): Promise<QuerySnapshot<T>> {
  const snapshot = await getDocs(query);
  recordFirestoreReads(source, snapshot.size);
  return snapshot;
}

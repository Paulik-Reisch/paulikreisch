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
 * forwards it to Cloud Logging as `jsonPayload`, so reads can be attributed to
 * the code path that issued them with a logs query, for example
 * `jsonPayload.message="firestore_reads"`. No extra Google Cloud product,
 * write or network call is involved.
 *
 * Only a static label (the data-access function name) and a document count are
 * logged. Paths, slugs, document ids and document contents are never logged.
 *
 * Coverage: reads issued in the Node.js server runtime through the helpers
 * below. Browser reads (client SDK in the visitor's browser, including
 * `onSnapshot` listeners) are not metered here.
 */

export const FIRESTORE_READS_LOG_MESSAGE = 'firestore_reads';

export type ReadMeterWriter = (line: string) => void;

/** Firestore bills a query that returns nothing as one read. */
export function billedReadCount(documentsReturned: number): number {
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
      documents: billedReadCount(documentsReturned),
    }),
  );
}

/** `getDoc` that records one billed read under `source`. */
export async function getDocMetered<T = DocumentData>(
  source: string,
  reference: DocumentReference<T>,
): Promise<DocumentSnapshot<T>> {
  const snapshot = await getDoc(reference);
  recordFirestoreReads(source, 1);
  return snapshot;
}

/** `getDocs` that records the billed reads of the result under `source`. */
export async function getDocsMetered<T = DocumentData>(
  source: string,
  query: Query<T>,
): Promise<QuerySnapshot<T>> {
  const snapshot = await getDocs(query);
  recordFirestoreReads(source, snapshot.size);
  return snapshot;
}

# Firestore read metering

Firestore reads are billed per document. To find out which code path causes them, every server-side read in `src/lib/firestore.ts` and `src/lib/worthaft-word-lists.ts` goes through `getDocMetered` / `getDocsMetered` (`src/lib/firestore-read-metering.ts`).

## What is logged

One JSON line per read call on stdout:

```json
{"severity":"INFO","message":"firestore_reads","source":"getLegalPage","documents":1}
```

- `source` is the name of the data-access function. It is a fixed label.
- `documents` is the number of billed reads. An empty result counts as 1.
- Paths, slugs, document ids, document contents and user data are never logged.

Cloud Run forwards stdout to Cloud Logging as `jsonPayload`. No new Google Cloud product, write or network call is added. The extra cost is one short log line per read call, well inside the free Cloud Logging allowance at the current traffic.

## Reading the result

In Logs Explorer:

```
resource.type="cloud_run_revision"
jsonPayload.message="firestore_reads"
```

Group by `jsonPayload.source` and sum `jsonPayload.documents` for a time window, for example with a log-based analysis query. Compare the sum with the Firestore usage graph for the same window.

## Coverage and limits

- Covered: reads issued in the Node.js server runtime (Server Components, Server Actions, route handlers) through the helpers.
- Not covered: reads in the visitor's browser (client SDK, `onSnapshot` listeners in `src/firebase/firestore/use-doc.tsx` and `use-collection.tsx`) and `src/app/admin/feedback/page.tsx`. Browser reads are not logged.
- Counts follow the documents returned to the SDK. They are an attribution aid, not an exact billing statement.
- A new `getDoc` / `getDocs` in the covered files fails the unit test `firestore-read-metering.test.ts`.

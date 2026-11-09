# Firestore read metering

Firestore reads are priced per document. To compare which code paths issue reads, every server-side read in `src/lib/firestore.ts` and `src/lib/worthaft-word-lists.ts` goes through `getDocMetered` / `getDocsMetered` (`src/lib/firestore-read-metering.ts`).

## What is logged

One JSON line per read call on stdout:

```json
{"severity":"INFO","message":"firestore_reads","source":"getLegalPage","documents":1}
```

- `source` is the name of the data-access function. It is a fixed label.
- `documents` is the number of documents the SDK returned for the call, counted as 1 when the result is empty.
- Paths, slugs, document ids, document contents and user data are never logged.

Cloud Run forwards stdout to Cloud Logging as `jsonPayload`. No new Google Cloud product, write or network call is added. The change adds one short log line per read call. How much Cloud Logging volume that adds, and whether it stays within the project's free allowance, has not been measured.

## What a counter represents

A line records a read call made through the helper and the document count the SDK returned for it. It is not a billing record, and it does not prove that the call was served by Firestore rather than by an SDK cache:

- `getDocs`: `documents` is the result size (minimum 1). Failed calls throw before the line is written and are not counted, although Firestore may have billed them.
- Queries that use index entries or aggregations can be billed differently from the returned count; this is not modeled.
- The client SDK can answer from a local cache. Whether that happens in the server runtime has not been verified, so a line may count a read that Firestore never billed. Browser calls are not metered at all.
- `fetchWorthaftWordList` is written only when the 48 h `unstable_cache` entry is rebuilt, so it follows actual REST requests (2 per rebuild).

Use the sums to compare code paths with each other and with the Firestore usage graph for the same window, not to predict the invoice.

## Reading the result

In Logs Explorer:

```
resource.type="cloud_run_revision"
jsonPayload.message="firestore_reads"
```

Group by `jsonPayload.source` and sum `jsonPayload.documents` for a time window, for example with a log-based analysis query. Compare the sum with the Firestore usage graph for the same window.

## Coverage and limits

- Covered: server-runtime reads through the client SDK in `src/lib/firestore.ts` and `src/lib/worthaft-word-lists.ts` (admin analytics, legal pages, landing pages, SEO, word lists for the definition route), plus the REST read in `src/lib/worthaft-daily-data.ts`.
- Not covered: `getPublishedExcerpts` in `src/lib/published-excerpts-server.ts` (REST through the Next.js fetch cache, so a cache hit cannot be told apart from a real read), and `src/app/admin/feedback/page.tsx` (browser, admin only).
- Browser code on the public site only writes (`addDoc` in the Worthaft game and feedback drawer). `useDoc` / `useCollection` listeners exist but nothing in `src/app` uses them.
- A new `getDoc` / `getDocs` in the two SDK files fails the unit test `firestore-read-metering.test.ts`.

# Worthaft word lists

The default Firestore database stores each list in its own collection:

- `worthaft-words/current`, field `words`: valid game words, in daily-word order.
- `worthaft-anti-words/current`, field `words`: words explicitly rejected by the game.

Both fields must be non-empty arrays of five-letter German words. Their array order is preserved. The server reads these documents and caches both lists in Next.js's data cache (`unstable_cache`, `revalidate` of 604800 seconds, tag `worthaft-word-lists`). The cache entry does not depend on the date. The word of the day is derived from the cached list and the Europe/Berlin date on every request, so a new day needs no Firestore read. A refill costs two document reads (REST, one per list). The static source lists remain as a fallback if Firestore cannot be reached; a failed read is not cached.

## What "once a week" means

The cache is not a guarantee of one read per week. Next.js keeps this cache in the file system of each running server instance, and `apphosting.yaml` sets `maxInstances: 1`. The lists are read again when:

- the entry is older than seven days,
- the instance restarted or a new deployment started (the cache starts empty),
- an admin refreshes the lists (see below),
- several requests arrive at the same moment on an empty cache; they may each trigger a refill.

Each refill costs two reads. There is no test that measures this on the live server; the unit tests cover the word selection and the pin only.

## After editing the lists

Saving in the Firebase console cannot notify the app. After an edit, sign in to the admin area and open `/admin/worthaft`, then press "Wortlisten neu laden". This calls `revalidateTag('worthaft-word-lists', { expire: 0 })` in a server action that requires the admin session (`src/lib/worthaft-refresh.ts`; sessions exist only after the admin credential check in the login action, the same model as every other admin action). Unit tests cover the cases without a session, with a session and a failing session lookup. The next game request reads both documents again. Without this step, an edit applies after the cache entry expires (up to seven days) or after a restart or deployment.

## Stable word of the day

Today's word is derived from the list and the date, so changing a list can change the word of the current day. To avoid this, the server remembers the word it chose for the current Berlin date and keeps it until the date changes, even if the lists are refreshed. This memory lives in the running server process only. It does not survive a restart or deployment, and it is not shared between instances that run side by side during a rollout. After a restart the word is derived again from the lists loaded then, so if the lists were changed earlier that day, the word of the day can differ from before. The previous date-keyed cache behaved the same way after a restart. Keeping the word stable across restarts would need stored state (for example a small Firestore document written once per day), which is not part of this change. Because the word depends on the list length as well, avoid changing the list during the day when it can be avoided; appending is not enough to keep the sequence, since the length enters the calculation.

To initialize an empty database from the current source lists, run:

```sh
npm run seed:worthaft-lists
```

The seed command refuses to overwrite either document if it already exists. To update the lists later, edit the corresponding `words` array in the Firebase console. The word of the day is the entry at (days since 2024-01-01) modulo the list length, so adding, removing or reordering entries changes the future sequence. The sequence uses the Europe/Berlin date for all players.

Firestore client reads remain public. Client writes across the entire database are restricted to the two verified admin accounts configured in `firestore.rules`. Firebase Console access is governed separately by Google Cloud IAM, and Firebase Storage has its own rules.

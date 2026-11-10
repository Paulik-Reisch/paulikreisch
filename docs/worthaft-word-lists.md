# Worthaft word lists

The default Firestore database stores each list in its own collection:

- `worthaft-words/current`, field `words`: valid game words, in daily-word order.
- `worthaft-anti-words/current`, field `words`: words explicitly rejected by the game.

Both fields must be non-empty arrays of five-letter German words. Their array order is preserved. The server reads these documents at most once per seven days and caches both lists in Next.js's data cache (`unstable_cache`, `revalidate` of 604800 seconds, tag `worthaft-word-lists`). The cache entry does not depend on the date. The word of the day is derived from the cached list and the Europe/Berlin date on every request, so a new day needs no Firestore read. The first request after a cache entry expires (or after a new deployment with an empty cache) refills it with two document reads. The static source lists remain as a fallback if Firestore cannot be reached; a failed read is not cached.

Editing a list in the Firestore console therefore takes effect after the current cache entry expires, up to seven days later, or earlier when the app is redeployed. Appending a word keeps the daily sequence intact. Do not change or delete earlier entries without accepting that the daily word can change once the new list is loaded. An already-open game is not changed.

There is no scheduled job in this zero-additional-service setup. Revalidating on edit (`revalidateTag('worthaft-word-lists')`) is possible later but needs an authenticated trigger; it is not part of this change.

To initialize an empty database from the current source lists, run:

```sh
npm run seed:worthaft-lists
```

The seed command refuses to overwrite either document if it already exists. To update the lists later, edit the corresponding `words` array in the Firebase console. Appending a word keeps the existing daily sequence intact until the new entry becomes the word of the day; changing or deleting an earlier entry can change future daily answers. The daily word sequence uses the Europe/Berlin date for all players.

Firestore client reads remain public. Client writes across the entire database are restricted to the two verified admin accounts configured in `firestore.rules`. Firebase Console access is governed separately by Google Cloud IAM, and Firebase Storage has its own rules.

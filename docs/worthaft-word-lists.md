# Worthaft word lists

The default Firestore database stores each list in its own collection:

- `worthaft-words/current`, field `words`: valid game words, in daily-word order.
- `worthaft-anti-words/current`, field `words`: words explicitly rejected by the game.

Both fields must be non-empty arrays of five-letter German words. Their array order is preserved. The server reads these documents when it first serves Worthaft for a Europe/Berlin calendar date and caches the lists and selected word in Next.js's data cache. Editing a list after that cache entry has been created takes effect on a later day; an already-open game is not changed. The static source lists remain as a fallback if Firestore cannot be reached.

There is no scheduled midnight job in this zero-additional-service setup. The first request after the Berlin day changes fills that day's cache, so it is not guaranteed to happen exactly at 00:00. A cache miss later that day can also pick up newer Firestore data.

To initialize an empty database from the current source lists, run:

```sh
npm run seed:worthaft-lists
```

The seed command refuses to overwrite either document if it already exists. To update the lists later, edit the corresponding `words` array in the Firebase console. Appending a word keeps the existing daily sequence intact until the new entry becomes the word of the day; changing or deleting an earlier entry can change future daily answers. The daily word sequence uses the Europe/Berlin date for all players.

Firestore client reads remain public. Client writes across the entire database are restricted to the two verified admin accounts configured in `firestore.rules`. Firebase Console access is governed separately by Google Cloud IAM, and Firebase Storage has its own rules.

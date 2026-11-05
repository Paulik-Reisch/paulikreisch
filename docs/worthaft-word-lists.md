# Worthaft word lists

The default Firestore database stores each list in its own collection:

- `worthaft-words/current`, field `words`: valid game words, in daily-word order.
- `worthaft-anti-words/current`, field `words`: words explicitly rejected by the game.

Both fields must be non-empty arrays of five-letter German words. Their array order is preserved. The game reads these documents when a page loads; reload an open game after editing a list. The static source lists remain as a fallback if Firestore cannot be reached.

To initialize an empty database from the current source lists, run:

```sh
npm run seed:worthaft-lists
```

The seed command refuses to overwrite either document if it already exists. To update the lists later, edit the corresponding `words` array in the Firebase console. Appending a word keeps the existing daily sequence intact until the new entry becomes the word of the day; changing or deleting an earlier entry can change future daily answers.

Firestore client reads and writes across the entire database are restricted to the two verified admin accounts configured in `firestore.rules`. This also blocks public-facing site features that depend on Firestore for visitors who are not signed in with one of those accounts. Firebase Console access is governed separately by Google Cloud IAM, and Firebase Storage has its own rules.

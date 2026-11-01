# Wikiland

`/game-labs/wikiland` is an original German article-guessing game inspired by the Redactle rules: guess a word to reveal all matching occurrences, and uncover the meaningful title words to solve the article. It uses the same blue/yellow palette, Inter/Poppins fonts and 10px corners as Bits and Worthaft.

## Content and modes

The game bundles 32 curated German Wikipedia excerpts, 334–474 words each at initial import. No runtime Wikipedia/API request is needed. Daily selection uses the calendar date in Europe/Berlin, rotating through this fixed corpus; the corpus therefore repeats after 32 days. Free rounds randomly select another article. An active round remains the current round across midnight until reload or a new round; reloading an older daily starts the new day's article. Switching modes confirms replacement of any unfinished progress. Only the current round is persisted; there is no account, cross-device history or multiplayer.

Sources, stable revisions, contributors, license and the repeatable update script are documented in [wikiland-sources.md](wikiland-sources.md). Excerpts and their shortened/redacted adaptations are CC BY-SA 4.0. Source/license information is accessible during play with a spoiler warning; the source link is also shown on completion. The independent game code does not copy Redactle code or assets.

## Behavior

- Word matching ignores case and equates ä/ae, ö/oe, ü/ue and ß/ss. Accents normalize. Other inflections require separate guesses; there is no speculative stemming or substring matching.
- Common German function words, punctuation and numbers start visible. Hidden words retain their lengths and are not present as text, title, data attributes or accessible labels in the rendered article. Accessibility labels describe only the number of hidden letters. This is a client-side puzzle, not an anti-cheat boundary: the bundled source text is necessarily available to someone inspecting the JavaScript.
- The full title can be entered in one attempt, or its meaningful words individually. Every successful word attempt reveals all matching words. Duplicates/already visible common words cost no attempt. Misses are retained. Hints reveal useful recurring non-title words first, then remaining title words, and count separately.
- Finding the title wins and reveals the whole article. Confirmed give-up reveals it without marking it solved. Results can be copied without spoiling the title; clipboard failure is handled visibly.
- The timer pauses while hidden, in dialogs or after completion. The rules and source dialogs restore focus to their buttons on close. Article/history layouts adapt to mobile; motion respects reduced-motion settings.

## Persistence

The current round is compactly serialized into at most four first-party cookies, each under 3,500 value characters, named `pr_wikiland_v1_0` … `_3`. They are scoped to `/game-labs/wikiland`, use `SameSite=Lax`, `Secure` on HTTPS and a one-year rolling expiry. Matching checksums, part counts and schema validation reject incomplete or corrupted state. Tests cover at least 500 ordinary guesses, and oversized writes fail without replacing the previous save. The UI reports save failure and remains playable in memory. Cookies are readable by client JavaScript because the game operates entirely in the browser; no identifiers or credentials are stored.

`SiteProviders` bypasses Firebase anonymous authentication, global tracking, theme storage and the consent banner on both cookie-only game routes. Other site routes keep their existing providers.

## Verification

```sh
npm run check
npm audit --omit=dev --audit-level=high
npm run build
npx playwright test tests/e2e/wikiland.spec.ts tests/e2e/bits.spec.ts
```

Pure engine/storage tests exercise matching, multiword titles, daily dates/DST, win/hint/give-up rules, corpus solvability, chunk budgets, blocked cookies and corruption. Browser checks cover guesses, duplicates, hints, restore, win/give-up/new-round confirmations, source/rules dialogs, hidden-word markup, isolated storage/networking, mobile/desktop layouts and automated accessibility.

No new packages are needed for Wikiland. The preceding Bits branch updates existing transitive `re2js` and `qs` versions; the production-only audit is clean. Development tooling still has moderate findings.

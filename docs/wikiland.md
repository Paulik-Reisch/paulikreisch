# Wikiland

`/wikiland` is a German Wikipedia word-guessing game: guess words to reveal every matching occurrence and find the meaningful title words. The original URL `/game-labs/wikiland` also serves the game.

## Content, structure and modes

The catalogue contains 32 curated article IDs and pinned Wikipedia revision IDs, not text excerpts. On opening or resuming a game the browser requests the complete parsed revision from the German Wikipedia MediaWiki API (`action=parse`, `oldid`, `prop=text|revid`, `origin=*`). The displayed title comes from the API, including disambiguation. The daily puzzle rotates through the fixed catalogue using the Berlin calendar date; free play selects a different article. Pinned IDs keep the chosen article revision stable, but MediaWiki may re-expand transcluded templates with newer template content. Changing revision IDs may change puzzles and invalidate hints; do not refresh them without a save-migration plan.

The complete returned text is indexed for guesses and hints even when not yet displayed. To keep large pages usable, the UI initially renders 30 top-level blocks and offers additional blocks on demand. It retains headings, paragraphs, lists, tables and other supported semantic structures. Remote markup is parsed in an inert template and rebuilt with an allowlist of element names: remote attributes, links, scripts and executable elements are never rendered. Images are not loaded; their text alternatives and mathematical alternatives are shown as text when available. Consequently the presentation is an adaptation and does not reproduce Wikipedia's styling, interactive features, images, or every non-text detail.

If Wikipedia cannot be reached, the game pauses and offers retry. It does not silently substitute a shortened excerpt or overwrite the saved game. Wikipedia receives the browser request and the user's IP address under its own privacy policy. There is no guarantee of offline play.

See [wikiland-sources.md](wikiland-sources.md) for attribution, license, version history and the limitations of the adaptation. Source and license are available during play with a spoiler warning.

## Behavior and persistence

Matching ignores case and equates ä/ae, ö/oe, ü/ue and ß/ss. Other word forms are separate. Common German words, numbers and punctuation start visible. Each hidden word visibly shows its letter count and exposes an accessible label without the word. The full title can be guessed at once, or its meaningful words individually; hits reveal every matching occurrence in the entire article. Hints, misses, give-up and solved states retain their previous rules. The article text is available to anyone inspecting the API response; this is not an anti-cheat boundary.

Select a word in the guess history to jump to its first occurrence. Selecting it again cycles through its matches in article order, expanding any blocks needed to reach the next match.

Progress is saved to up to four first-party cookies per game URL, with checksums and size limits. Each cookie is scoped to its game URL. On the short URL, the first visit can recover an existing save through the same-origin endpoint under the original cookie path. The article itself is not stored in cookies. A completed legacy game remains completed if a newly displayed disambiguation suffix changes its title. Hints are checked against the fetched revision before accepting the saved state; if they no longer match, the UI reports this rather than overwriting it. The timer pauses while loading, in dialogs, when hidden and after completion. Failed or oversized cookie saves are reported.

## Verification

```sh
python3 scripts/update-wikiland-data.py
npm run check
npm run build
npx playwright test tests/e2e/wikiland.spec.ts
```

Unit tests cover parsing of API responses, revision mismatches, word matching, letter counts and cookie compatibility. Playwright mocks Wikipedia for repeatability and covers full-article indexing, later sections, markup safety, API failure/retry, restored state, mobile layout and accessibility. Run a separate live API smoke test when network access is available: mocks cannot validate Wikipedia's current response or availability.

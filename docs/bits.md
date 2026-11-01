# Bits

Route: `/game-labs/bits`, discoverable from Game Labs. Original implementation of the Takuzu rules described by [0h h1 / Q42](https://0hh1.com/): equal counts of both bits in every row and column, no three adjacent identical bits, no duplicate completed rows or columns. No source code or assets from 0h h1 are used.

## Architecture

- `src/lib/bits-engine.ts`: dependency-free deterministic seeded generator and bounded-solution-count solver. Generates a valid board from legal row patterns, then removes clues only when exactly one solution remains. Supports 4×4, 6×6 and 8×8. Completion checks the rules, rather than comparing against a hidden answer. Hints explain direct rule exclusions or a forced value in the unique solution; incorrect moves receive a correction hint.
- `src/lib/bits-storage.ts`: versioned compact first-party cookie `pr_bits_v1`. Scope `/game-labs/bits`, `SameSite=Lax`, `Secure` on HTTPS, expiry one year from last save. Contains puzzle, board, timer, hint count and up to 20 undo states. Encoded size capped at 3,800 characters. Parser validates all fields and immutable clues; damaged cookies start a new game. No identity or account data. Blocked cookies leave the game playable in memory.
- `src/app/game-labs/bits/page.tsx`: responsive board, keyboard navigation and entry, hints, rule checks, undo, confirmed reset/new game, timer paused while hidden or a confirmation is open, completed state and a rules popup that pauses the timer. Cookie management is available through browser settings. Reload starts a fresh game if no cookie exists.
- `src/components/site-providers.tsx`: preserves the site's existing providers on other routes and omits Firebase authentication, global tracking, theme storage and consent UI on Bits. The Bits page must remain independent of Firebase hooks. Direct visits use neither localStorage nor sessionStorage. Visiting another part of the website can still invoke its existing providers.

Game Labs currently inherits `noindex`; Bits follows that convention. Revisit discovery metadata deliberately if moving the game out of the laboratory.

## Verification

```sh
npm ci
npm run check
npm run build
npx playwright test tests/e2e/bits.spec.ts
```

Focused tests cover unique generation, validation, hints, cookie corruption and budgets, mouse/keyboard controls, resume, undo, reset, win, blocked storage and rules-popup keyboard/focus behavior, route-provider transitions, layout at 320/390/1440px and an automated WCAG A/AA scan. Browser tests can reuse the production server on port 9002 (`node node_modules/next/dist/bin/next start -p 9002`) so authentication isolation is also checked without the local-preview flag.

Additional one-off generator review checked 100 seeds for each size (300 unique puzzles) and independently enumerated the 72 legal 4×4 solutions to cross-check sampled puzzle uniqueness.

## Existing repository findings

No dependencies were added or upgraded. The 2026-11-01 audit reports 18 existing dependency findings (17 moderate, one high); the production-only audit reports `qs` (moderate) and `re2js` (high). Dependency remediation is separate from this game. Production build also reports the existing React 18/middleware deprecations and dynamic filesystem tracing in `src/lib/rag.ts`; the build completes successfully.

## Visual alignment with Worthaft

Bits uses Worthaft’s original palette (`#0067d9` blue and `#e8be3c` yellow), Inter/Poppins typography, a compact centered board, 10px tile/control rounding, and its sunshine asset. Rules and keyboard instructions live in an accessible dialog. Public provenance, storage boilerplate and in-game cookie deletion controls have been removed from the game screen; this technical document retains implementation provenance.

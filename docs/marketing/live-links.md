# Live URL and tracking-link shortcuts

Published landing pages and ads have `Live-URL kopieren` and `Tracking-Kurzlink erstellen` actions in the document list and editor. Each click reads the existing authenticated document endpoint and uses only `published.document`, including its slug, kind, name and campaign. Draft edits cannot change a copied live URL or the prefilled tracking form. If the publication was withdrawn, the action fails without a draft fallback.

Hosts match `src/marketing/model.mjs` and the public handler: `lp.paulikreisch.de` for landing pages, `ads.paulikreisch.de` for Google/Meta/other ads. Newsletters have no shortcut because they have no public web archive. Tracking-link preparation is manager-only and makes no write: the user reviews the prefilled form and submits the existing create action. Name and campaign use the short-link service's 100-character limits.

Verification: `node tools/marketing/scripts/test-live-links.mjs` renders the actual studio HTML/CSS/JS with isolated API fixtures, at 320, 375, 390, 414, 768 and 1440 CSS pixels. It checks divergent live/draft values, LP/ad hosts, withdrawal, editor shortcuts, private/newsletter exclusion and zero write requests. Screenshots are local fixture renders, not live account screenshots.

# Kurzlinks: isolated integration handoff

Base: integration owner's 2026-11-13 working archive, GitHub source commit ad8ce642f7fd9bbe735bdf6c8dbd3fc60de9f8fc. No middleware, authentication policy, shared login, DNS, environment, IAM, rules or production changes are included.

## Route integration required

- Dedicated public redirect authorities: `l.paulikreisch.de` (canonical) and `link.paulikreisch.de` (legacy alias). At 16:00 CET on 13 November, Firebase App Hosting showed the existing *.paulikreisch.de wildcard connected. A TLS-verified request to https://l.paulikreisch.de/a6W7 reached this backend (then still apex-redirected by old middleware). No DNS/domain/account mutation was needed. Verify the new middleware after deploy; the example path is not a live record.
- On ANALYTICS_HOST only, internally rewrite `/links` to `/analytics-private/links`, preserving search parameters for opaque pagination and feedback. Require the existing exact same-origin guard for non-GET/HEAD requests. Do not redirect this page to Admin or share cookies across hosts.
- Add a normal same-host `/links` navigation link to the Analytics overview. Replace its inaccurate current 'nur Lesen' header with 'Geschützte Auswertung und Kurzlinks · keine Inhalts- oder Dateiverwaltung'. Login/session behavior stays isolated and unchanged.
- On SHORT_LINK_HOST only, internally rewrite exactly valid single-segment four-character/custom codes and unchanged legacy 16-character IDs to `/link-private/[code]`, GET and HEAD only. Drop query parameters. Deny all mutation methods. Other paths should be a generic 404, not a redirect to Admin, Analytics or apex. Shared `_next` resources are unnecessary for the redirect response.
- Hide `/link-private` and all its descendants on every other host, including apex, Admin, Static, Analytics and backend/default hosts. Existing hidden-management path logic must include it. A handler also checks the host defensively.
- No global shared-cookie domain or new auth provider. Creator/status actions require Analytics audience/session, exact Origin and a current verified/non-disabled allowlisted Firebase account. They grant no content-admin or file capabilities.

## Release gate and private storage

Set `SHORT_LINK_RELEASE=private-prefix-v1-accepted` only after host routing, storage privacy and live access are verified. Without the gate the creator is disabled and public handlers return 404.

Records use the existing bucket `hallo-welt-paulik-reisch.firebasestorage.app`, exclusively under `managed-private-v1/shortlinks/[code].json`. Existing deployed Storage rules must deny client get/list/write on the entire managed-private-v1 prefix, and GCS ACLs must remain private. No new Firestore collection: existing repository Firestore rules permit public reads. No new download tokens, signed object URLs or IAM grants are created by this patch. Adapter rejects public ACLs and Firebase download tokens on read. Verify current runtime service access already covers this private subprefix; if not, stop and report rather than granting broadly.

Metadata contains only code, campaign label, fixed HTTPS target, active flag, aggregate request count and creation time. No creator email, IP, referrer, user agent, cookie, device ID or individual click records. Hosting logs are separate and must not be described as absent. The target is public to anyone using a valid active code; a shortlink is not an access-control mechanism.

## Behavior and measurement limits

- 12 cryptographic random bytes produce a 16-character base64url code (96 bits). Create-only Storage preconditions prevent replacement on collision.
- Fixed target only; no target edits or caller-provided query forwarding. HTTPS only, no credentials, IP literals, private/local names, nonstandard ports or known management/redirect hosts. The server never fetches the target.
- Revocable 302 redirects with no-store, no-referrer and noindex headers. Missing/disabled codes have the same generic 404. Storage errors return a generic 503, not stale targets.
- Counts are successful eligible GET redirect attempts, NOT unique visitors, conversions or consented site-analytics sessions. HEAD and explicit prefetches do not count. Bots and previews can count. Counters are best effort and can undercount during write conflicts or failures. Failed counter writes do not break redirects.
- Exact-generation CAS protects status/count updates. A stale counter cannot reactivate or overwrite a revoked link. A request already in flight at deactivation may still finish.
- Deactivation/reactivation only. No bulk deletion or changes to existing assets.

## Costs and operational checks

No dependency, paid analytics vendor, paid service, Firestore index, DNS purchase or secret is added. Existing App Hosting/Cloud Storage billing still applies; this is not a promise of zero cost.

Each normal active GET uses one object metadata read, one ACL read, one generation-qualified download and one conditional write. HEAD uses three reads and no write. Missing valid codes normally make one metadata request. Malformed codes are rejected before storage access. No automatic polling or retry loop is added. Analytics list pages load at most 25 objects (one list plus three reads per record); refresh only on user navigation or submitted changes. This model avoids per-click event objects and unbounded counter retries, but a heavily publicized link increases existing runtime/storage usage. If high-volume campaigns or material recurring cost are expected, evaluate an approved alternative before enabling; do not add an unapproved paid service.

## Verification performed and remaining

Local `npm ci --ignore-scripts` succeeded. Existing lockfile/dependencies unchanged. Lint, TypeScript and all 252 unit tests passed (15 new). New tests cover target/code validation, HEAD/prefetch handling, fail-closed records, private ACLs/tokens, create preconditions, counter conflicts and revocation races.

Actual component pixels inspected at desktop 1280px and mobile 390px using synthetic fixtures, real project CSS and the production ShortLinksPanel component. No clipping/horizontal overflow; labels and action buttons readable. Fixture server actions were stubs and the outer page shell was recreated, so this is component visual QA, not authenticated end-to-end release proof. Live Analytics baseline was also inspected separately in the native browser.

Before reporting live: run combined routing/auth/isolation tests and full build; verify native Analytics `/links` entry stays on its host, signed-out login stays there, CSRF/anonymous requests fail, other hosts do not expose internal pages, real create/copy/GET count/HEAD/no-count/deactivate/reactivate work. Use only a clearly identified synthetic test link and disable it afterward. No live test link or object was created by this worker. Confirm public raw storage get/list access is denied without exposing targets. Verify exact live DNS/TLS authority, headers, no target-query override and cost/release gates.

Suggested accurate privacy addition for review alongside deployment: 'Unsere Kurzlinks leiten auf ein beim Erstellen festgelegtes Ziel weiter. Wir speichern je Kurzlink den Namen, die Zieladresse, den Erstellungszeitpunkt, den Aktivierungsstatus und eine zusammengefasste Anzahl von Weiterleitungsanfragen. Dafür legen wir keine Cookies, Besucherprofile oder einzelnen Klickprotokolle an und speichern in dieser Zählung keine IP-Adressen, Gerätekennungen, Referrer oder User-Agents. Technische Protokolle des Hosting-Anbieters sind davon unabhängig. Die Zahl kann automatisierte Aufrufe enthalten und ist keine Zahl eindeutiger Besucher.' This is a technical description, not a legal compliance determination.

## Integration checkpoint, 13 November 2026

Prepared separately after focused PR108. Current integration preserves PR108 corrected desktop/mobile header and Max PR107 footer. Read-only readiness established wildcard custom-domain connection, existing bucket/runtime both us-central1, Standard regional bucket, versioning off, seven-day soft-delete retention and no lifecycle rule. No new service or IAM expansion is planned. The existing runtime role evidence is not an effective-permission canary. Exact deployed Storage rules, final release configuration and bounded live synthetic create/GET/HEAD/CAS/deactivation acceptance still require verification before enabling. Existing hosting/storage usage is billed; published pricing is neither a quote nor a cap.

## 13 November shorter-link extension

Canonical displayed/copy URL is https://l.paulikreisch.de/CODE. Keep both shortlink authorities serving the same records directly, without migration or redirects between the two. Existing codes, records, destinations and counters stay intact. New options are cryptographically random four-character base62 (default), four-character lowercase hex, or a case-sensitive 4-32 character custom name. Custom names cannot replace an existing record; random/hex collisions retry at most 12 atomic create-only writes. Four characters are deliberately enumerable, not a secret or permission check. Never shorten access credentials or confidential documents. No automatic tracking parameters or target fetching added. No extra storage system, account roles or paid service. The existing connected wildcard Firebase domain covers l.*; verify DNS/TLS and live host isolation before completion.

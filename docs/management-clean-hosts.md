# Same-host management routes

Admin, Static and Analytics are separate authenticated surfaces.

- `admin.paulikreisch.de/` internally serves the authors dashboard. Known short management paths rewrite to internal `/admin` routes, preserving queries. Old GET bookmarks canonicalize to short paths; mutation requests are never redirected across hosts.
- `static.paulikreisch.de/` internally serves a dedicated file-management shell. `/login`, logout and file actions stay on this host. Historical `/upload` and `/_upload` entries canonicalize to its root. Only safe opaque `/f/{uuid}` downloads are public. `/file/{uuid}` is authenticated and `/acceptance` retains the bounded test-cleanup safeguards.
- `analytics.paulikreisch.de/` retains its own existing authentication and dashboard.

Static sessions use a distinct host-only cookie and a Static JWT audience. Admin sessions retain their original audience. Neither session can authenticate as the other. General admin mutation guards and `getSession` remain admin-only; file-specific actions explicitly opt into Static after an exact same-origin check. Analytics is unchanged. All management hosts suppress visitor tracking and consent banners. Existing public images and their tokens are untouched.

The one remaining acceptance TXT exception binds the exact asset ID, nonce, name, content type and 46-byte size. It retains private ownership, no-token/private ACL, signed plan, generation and metageneration preconditions and sidecar-first deletion. No legacy or unrelated object is eligible.

Validation: lint, typecheck, route/session isolation unit tests, changed-source Semgrep, targeted production build and desktop/mobile login pixels. The full production pipeline and post-rollout authenticated host/session checks are separate acceptance gates.

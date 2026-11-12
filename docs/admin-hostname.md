# Admin hostname separation

## Architecture

The public site and administration share one Next.js application and Firebase App Hosting backend. This is routing separation, not process or deployment isolation. Authorization remains server-side session checks and Firebase rules.

Production admin origin: `https://admin.paulikreisch.de`.
Public origin: `https://paulikreisch.de`.

- The admin root redirects to `/admin`.
- `/login`, `/admin`, and `/internal` plus their descendants are served on the admin hostname.
- Public-host GET/HEAD requests for those paths redirect to the same path on the admin origin, preserving the query.
- Unsafe methods targeting those paths on another host fail with 403. Token-bearing bodies are never redirected across hosts.
- Public pages visited on the admin hostname redirect to the public origin. Shared framework/static assets remain available.
- Other wildcard hosts and the old hyphenated domain retain public canonical redirects for safe methods.
- Admin-origin responses carry `X-Robots-Tag: noindex, nofollow, noarchive` and private/no-store cache control. Login/admin/internal page metadata also opts out of indexing.

## Trust and authorization

The external host is resolved from Firebase's forwarded authority. Malformed authorities, forwarded lists, foreign forwarded names, and conflicts between recognized direct/forwarded site hosts fail closed for privileged use. Redirect destinations are fixed constants, never caller-supplied host strings.

Admin mutation requests require an exact HTTPS admin Origin. Next.js Server Action checks remain enabled, with no wildcard `allowedOrigins` exception. Login/logout enforce the same rule inside their Server Actions, independent of the route on which an action ID is submitted.

Firebase ID-token verification, verified-email requirement, and the existing admin email allowlist remain unchanged.

A new production `__Host-admin-session` cookie is HttpOnly, Secure, SameSite=Lax, path `/`, and has no Domain attribute. Signed tokens carry the admin hostname as their audience. Old generic `session` cookies are not accepted by the new admin flow. Existing users sign in once on the new hostname; no database credentials are read, deleted, or migrated.

## Admin chrome

The public newsletter footer is not mounted in the admin layout. Admin footer links explicitly point to public legal pages and retain the theme switch. The header's public-site link is absolute, so `/` on the admin hostname cannot send users back into their dashboard by mistake. Public analytics and cookie banner components are omitted on rendered admin/login/internal paths. The Firebase context remains available.

## Logout and server module boundary

Logout clears Firebase client authentication before revoking the server session. A failure is shown as a failed logout rather than reporting success. A failed client signout does not silently discard the server session while leaving client credentials active. Retrying after a server error is supported.

The email implementation remains server-only but is no longer itself marked as a Server Action module. Existing validated public subscription and authenticated admin action callers stay in place. No email is sent as part of verification.

## Review and rollout gates

This draft is not ready for production until all gates below are complete:

1. Verify existing `/internal` editor/database tools under the admin origin, including the new shared session-guarded internal layout. Bookmarks redirect to the same path; no tool is retired.
2. Independently review exact forwarded-host trust against the current Firebase proxy behavior and backend authority.
3. Run repository `npm run check`, `npm run build`, and applicable end-to-end tests on the complete current checkout; isolated changed-module tests are not substitutes.
4. Reconcile any later main changes, including the separate login darkmode fix, without incorporating unrelated cleanup.
5. Merge only after the shared deployment coordination and spending authority are satisfied.
6. Verify live HTTPS admin root/login/deep-link routing, public-page redirects, noindex/no-store headers, no redirect loops, forged host/origin rejection, session cookie attributes, successful login and logout.
7. A production content-write test requires separately agreed safe target/data; do not create or delete real content merely to demonstrate this move.

No second backend, DNS mutation, paid service, database cleanup, or legacy credential-document removal is part of this change.

## Verification so far

At base commit `60945c92a996dff1662820ab291fab32b9637dc1`, 42 isolated tests exercise host parsing, exact Origin checks, and the real NextRequest/NextResponse middleware contract. The admin-login regression was run against the original middleware and failed with a redirect to the public origin, then passed with the draft. Tests also cover internal-route migration, JWT audience/expiry, and client-before-server logout with explicit failure propagation. Full project checks and live acceptance remain outstanding.

## Rollback

Revert the isolated admin-host change and deploy the revert through the existing hosting flow. The former public-host login returns. New admin cookies will no longer be read, and users may need to sign in again. Do not restore plaintext credential documents or undo the earlier Firebase Auth migration as part of a routing rollback.

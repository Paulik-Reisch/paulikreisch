# Marketing studio

A separate implementation for `m.paulikreisch.de`, `lp.paulikreisch.de` and
`ads.paulikreisch.de`. The old admin tools, authors, newsletter records and
recipient data are not migrated or removed.

## Architecture

The exact-host middleware routes to the Node handler in
`src/app/marketing-private/[[...path]]/route.ts`. Other hosts receive 404 for
implementation paths. `src/marketing` contains validation, auth, persistence,
rendering and generated studio assets. Existing Firebase ADC, Auth allowlist and
`SESSION_SECRET` are injected by the adapter; there is no service-account key in
source. Each host has its own Secure, HttpOnly, SameSite=Strict host cookie,
signed audience and CSRF token. Accounts are checked for verification,
disablement, revocation and allowlist membership on authenticated requests.

New features are gated by `MARKETING_STUDIO_RELEASE=structured-v1-accepted`.
Without it the feature is unavailable, including on its dedicated hosts.

### Persistence and privacy

The small-team store has at most 200 documents and 5 MB encrypted state under
`managed-private-v1/marketing-v1/state.enc`. The distributed login limit is in
`login-limits.enc` under the same prefix. AES-256-GCM encryption uses a
purpose-derived key, object-specific authenticated data, CRC32C and generation
preconditions. Anonymous Firebase Storage reads of the whole private prefix must
remain denied. Public object ACLs and Firebase download tokens fail closed.
Bucket/IAM checks are required in addition to encryption. The adapter assumes
object ACL checks are available and must be tested against the production bucket.

`SESSION_SECRET` rotation changes the encryption key: decrypt/re-encrypt state in
a controlled operation before replacing the key. Keep an encrypted backup and
test recovery. Do not simply rotate this secret after records exist.

Drafts are never public. Publishing creates an immutable snapshot. Later edits
do not change it. Revision preconditions prevent lost writes; publication checks
slug ownership atomically. Published records must be withdrawn before deletion.

### Editors and virtual files

Monaco 0.57 and CodeMirror 6 support HTML, CSS and JavaScript. The studio bundles
both locally, without a CDN. A separate reproducible build toolchain is in
`tools/marketing`:

```
cd tools/marketing
npm ci
npm run build
```

Generated assets are committed at `src/marketing/generated-assets.mjs`, allowing
the production app to build without adding editor dependencies or requiring a
second package install. UI source and licenses live in the build toolchain.
Monaco vendors DOMPurify internally; the build plugin redirects that private
import to patched DOMPurify 3.4.18. An npm override alone is insufficient.
Verify the generated legal notice after dependency updates.

Custom code runs in an opaque sandboxed iframe with no parent DOM or studio
session access. CSP blocks external scripts, network APIs, forms, nested frames
and workers. Public custom pages permit user-gesture top navigation, but private
previews do not. This is not an unrestricted web-application host.

Aliases map literal quoted paths or `{{asset:/bilder/cover.jpg}}` tokens to
existing shared `https://static.paulikreisch.de/f/<uuid>` assets. The file manager
link opens the existing static manager. No files are copied or uploaded, no
private asset is silently shared, and computed paths are not supported.

### Formats and boundaries

Structured LPs contain at most 12 funnel steps and own-static images. Google
responsive search assets enforce 3-15 headlines of at most 30 characters and
2-4 descriptions of at most 90 characters. Double-width language counting and
network policy approval are not implemented. Source checked 2026-11-16:
https://support.google.com/google-ads/answer/7684791

Hosted ads are content previews, not Google/Meta campaigns. No spend, activation,
tracking, checkout or digital-product fulfillment is added. Newsletter export is
table HTML with inline styles plus plain text. It is explicitly not send-ready:
a sending system must add sender identity, consent/suppression handling and
personal unsubscribe URLs. Newsletter publication and delivery remain disabled.
Real Gmail/Outlook rendering remains a required pre-send acceptance check.

## Verification

`npm run check` includes the existing app suite, host-routing tests and 29
marketing tests. Tests cover drafts, publication, concurrency, host-scoped auth,
CSRF, CSP, virtual paths, encryption and persistence across adapter restarts.
The standalone visual harness covers 320/375/414/768/1440px, both real editors,
engine switching, saved paths, decoded HTTPS images and parent-DOM/network denial.
Local fixture auth and memory storage must never be used in production.

Before release verify exact DNS/TLS for all hosts, the Firebase Auth referrer
restrictions, actual private bucket access and authenticated throwaway-data
create/edit/preview/withdraw/delete, persistence and cleanup. Do not publish
example advertising copy. Preserve a route-disabled rollback commit.

## Cost and operation

Use the existing backend, existing bucket and existing credentials. Do not add
minimum instances or increase the shared backend's maxInstances. No separate
paid service or paid GitHub Actions is authorized by this feature. The owner
approved this existing-Firebase expansion on 2026-11-16 after disclosure of
existing monthly costs and the lack of a hard monetary cap.

The byte/document bounds are not a monetary cap. Public requests read state
through the server; traffic and rejected requests can still incur Cloud Run,
Storage and network charges. Budgets/alerts are not enforcement. Evaluate cost
and caching before a high-traffic campaign. Do not shut down the shared book site
to enforce this feature's spending, or change other cloud services without scope.

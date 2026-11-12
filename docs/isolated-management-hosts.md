# Isolated management hosts and private files

## Host boundaries

- `admin.paulikreisch.de` keeps the existing administrator allowlist and hosts file and Worthaft management.
- `analytics.paulikreisch.de` uses its own host-only session cookie, origin and audience. The Firebase browser key must allow only the additional exact analytics referrer; other restrictions stay intact.
- `static.paulikreisch.de/f/<id>` is a read-only public gateway for explicitly published assets. Anonymous upload and public listing are unavailable.

## Private assets

Uploads start private under `managed-private-v1/`. The Storage rules deny Firebase client access to this prefix. Server-side access uses the existing runtime identity, validates object ACLs and rejects download tokens. Sidecar metadata and blobs use generation preconditions. Legacy objects are neither moved nor made private by this change.

Raster images are decoded and re-encoded. Text requires valid UTF-8. PDF processing rejects active content, forms, embedded files and links, then re-saves within bounded worker resources. These checks are not an antivirus service. Uploads are limited to 5 MiB; raster dimensions and PDF resources have separate limits.

Publishing and withdrawing require explicit authenticated administrator actions. The static gateway always checks current metadata and returns attachment responses with no-store controls.

The release gate is `PRIVATE_ASSET_RELEASE=private-prefix-v1-accepted`. The temporary authenticated acceptance screen additionally requires a nonce and UTC expiry no more than 24 hours ahead. Its signed cleanup plans bind the current administrator, file IDs and exact blob/sidecar generations. Only the small private acceptance fixtures belonging to that administrator are eligible. The screen expires without another build.

## Worthaft

`WORTHAFT_DAILY_RELEASE=persistent-v1-accepted` enables the durable `worthaft_daily_words_v1/<BerlinDate>` record. A transaction chooses the date once and never overwrites an existing answer. Migration must seed only today's freshly verified served answer before activation. Do not seed future dates.

Word-list edits preserve ordering and duplicates unless deliberately changed. Revision conflicts retain the draft. Today's durable answer remains guessable even if future lists remove or block it. Moderation preserves original reports and provides bounded pagination. Real word lists are not changed during deployment acceptance.

## Analytics

The dashboard covers six Berlin calendar months, uses a bounded timestamp query and a short per-instance cache, and fails explicitly on query overflow. It does not manufacture purchase-conversion metrics or infer a positive-feedback rate from negative-only stored feedback. Mixed event queries can consume reads beyond the displayed event category.

## Release acceptance and rollback

Run `npm run check`, production build, dependency audit and the existing CI workflows before merge. Verify login/logout, host isolation, private upload and deliberate publication/withdrawal with three small image/PDF/text fixtures. Delete those fixtures through exact-generation authenticated cleanup and verify absence.

Merge once into the existing Firebase App Hosting backend. On failure, stop without automatically starting another build. Use the retained previous rollout for instant rollback where needed, keeping the private-prefix deny policy intact. Existing file URLs, word lists and the current daily answer must remain unchanged. Storage, analytics and runtime costs remain usage-based, not guaranteed by a monthly hard cap.

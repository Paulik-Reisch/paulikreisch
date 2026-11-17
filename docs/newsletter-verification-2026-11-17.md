# Newsletter implementation and verification, 17 November 2026

## Live outcome already completed

- Exactly one approved fixed technical email was submitted from the studio at 12:03 CET. Resend reports Delivered. Gmail independently returned one matching message at 12:03:25 CET with INBOX and CATEGORY_PROMOTIONS labels.
- Provider evidence: https://resend.com/emails/01a1e92d-0a50-7bc3-ad42-7ac44974a3f6
- Temporary fixed-probe flag removed in PR146, main c61950e. Build bbc98147-97f8-4609-94a1-139ff6bfbe95 succeeded; the authenticated probe GET returned enabled:false at 12:08 CET.
- The create-only probe claim exists with creation time 12:03:25. Do not delete or reset it. No second probe is authorized by these results.
- Summer document 18ecf984-fe6c-4300-bf21-73fe1257b5ae was still revision 5 with published:null at 12:08 CET.
- STORE, SEND and FUNNEL remain off. No reader was created, imported, subscribed or mailed. The historical foreign-domain unsubscribe link was not changed.

## Isolated verification prepared after the live probe

The following checks execute production route code and production token/subscriber/webhook/rendering logic. Only the framework/environment and persistence boundaries are replaced. Every address, key, record, publication and provider response is a fixture. No real account or network is used.

Command:

```sh
npx tsx --test tests/unit/newsletter-route-runtime.test.ts
```

Covered:

- Manual token unsubscribe works while registration and sending are off; a repeat succeeds without changing history.
- RFC8058 requires the correct POST body. Neither removal route exports a GET mutation.
- Bad syntax, wrong purpose and unrelated signing key reject before opening the database. Previous token signing keys work; unknown records are never created or falsely removed.
- Removal disabled returns 503 without database construction.
- Signed permanent bounce, complaint and suppression change an existing fixture to suppressed. Repeated feedback and later unsubscribe cannot revive consent or change terminal suppression.
- Events for another sender/project, transient bounce and delivery do not open the database. Feedback for unknown recipients does not create one.
- Missing signature, raw-body alteration, stale timestamp and disabled feedback fail closed before database construction.
- The browser route serves only an explicitly published immutable newsletter fixture, never its later draft edit, recipient token or unsubstituted placeholder. Disabled release and invalid slug reject before storage.

This proves the application logic and route binding under isolated dependencies. It does not prove actual Firestore persistence, provider webhook transport, or a real email client's RFC8058 behavior.

## Remaining campaign UI fix prepared, not deployed

The ordinary campaign send branch still used a native prompt in live main after the technical-probe fix. This branch replaces it with the same normal inline exact-phrase confirmation. It disables the preflight trigger while the request/review is pending and records attempted document/digest pairs for the current page session. Cancel and zero-recipient preview do not submit. An uncertain POST cannot be repeated by reopening the same preview in the same session. Both source and actually served generated assets are updated together.

Command:

```sh
npx playwright test --config playwright.newsletter.config.ts
```

The fixture-only suite exercises both technical-probe and ordinary-campaign UI, including exact phrase, double click, cancel, navigation before/after a pending preflight, blocked state and uncertain result. The campaign-native-prompt regression fails against the original served code. Screenshots at 320, 375, 414, 768 and 1440 pixels are inspected. No general sending flag or real recipient is needed.

This UI guard is intentionally not a durable campaign ledger. Reloading or using another session clears it. The campaign backend uses deterministic provider idempotency keys but has no permanent campaign attempt/result journal. For a later unsupervised repeat-campaign workflow, durable campaign attempt/result handling and explicit recovery semantics for partial/uncertain outcomes are a separate engineering follow-up, not permission to change this patch or activate sending. Do not repurpose or reset the fixed technical-probe claim for campaigns.

## Work not inferred from the successful transport test

1. Actual positive unsubscribe against a real existing confirmed record has not been run. There are no such records. The isolated route/store test is complete; a real positive end-to-end check would need an explicitly authorized existing/test recipient and its signed link. Do not create a reader just to remove one.
2. No real permanent-bounce, complaint or provider-suppression callback has been observed. Fixture signature and route tests are complete. Do not trigger another mail, a spam complaint, or a suppression in the user's provider account without a separately authorized test design.
3. Summer HTML has not been delivered to Gmail/Outlook for rendering QA. The approved technical email was a fixed plain message, not a campaign design test.
4. Public browser rendering is fixture-tested. The real summer browser URL correctly stays unavailable until an explicit publication decision. Do not publish merely to make a test pass.
5. Public registration remains off. Before enabling it, settle form-consent wording, frequency and funnel content; existing source forms differ. No legal-compliance guarantee is claimed.
6. Old provider-native unsubscribe compatibility needs the original scheme and provider support. The foreign-domain historical link is outside this patch.
7. A later deployment of this prepared patch needs its own successful deployment and live source/served-asset check. No deployment, GitHub Actions, new service or paid build is started by local verification.

Zero recipients, the private summer draft and disabled public signup/general sending are intended safeguards, not incomplete implementation by themselves.


## Local check record

- `npm run check`: lint and TypeScript passed, 365 unit tests and 89 marketing/newsletter tests passed.
- `playwright.newsletter.config.ts`: 12 fixture browser tests passed, including navigation cancellation and the served-asset layout regression.
- 14 of the unit tests are the new isolated production-route tests described above.
- Full production build was not repeated in this local-only phase. Earlier local build attempts were constrained by memory/timeout and an unrelated existing CSS issue. The preceding deployed c61950e build succeeded; that does not validate deployment of this new patch.

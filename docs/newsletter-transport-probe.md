# Fixed transport probe

The marketing studio reviews the server-returned fixed message in an inline confirmation. The exact phrase enables the separate send button. Cancel, Escape and navigation cancel the confirmation. Disabled runtime configuration reports a blocked test without a native browser alert.

The probe button stays disabled after any POST attempt, including an uncertain result. Reloading does not bypass the server's durable create-only claim: the private Storage object is written before contacting Resend and is never reset. Fixed recipient, sender, message, approval digest and provider idempotency key remain server-owned. No newsletter recipient or subscription is created.

The temporary runtime flag must be removed after the bounded test. General STORE, SEND and FUNNEL flags stay off. Provider acceptance, inbox delivery and suppression-webhook delivery are separate checks.

Targeted fixture-only UI tests (no provider connection):

```sh
npx playwright test --config playwright.newsletter.config.ts
```

For a locally installed Chrome, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its binary. The suite covers exact confirmation, no native dialog, cancellation, disabled runtime, double-click protection, uncertain results and five viewport widths. Screenshots are written to the test output directory. Existing server transport tests remain in `tests/newsletter/transport.test.mjs`.

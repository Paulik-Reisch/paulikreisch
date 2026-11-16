# Legacy newsletter retirement

Prepared against main 533bd42614180cc1a6f624318bdd6c1c69a15de9 (16 November 2026).
The pre-existing legacy form branch could add a contact/subscriber, send a funnel
Day-0 message and queue later messages while the new STORE gate was disabled.
The legacy dispatcher read its configured secret without checking it. These
paths did not consult the new newsletter flags or new consent/suppression store.
No dispatch request, signup, recipient or queue read was used to establish this.

This fix retires dispatch rather than adding a new way to reactivate it:
- Legacy process route GET and POST return 410 and import no dispatch code.
- Direct calls to the legacy queue function fail before reads, writes or sends.
- Public forms use the new DOI path only when the existing STORE gate allows it.
  Otherwise they return an honest unavailable error, with no legacy fallback.
- Existing queue/subscriber records are retained unchanged. There is no migration
  and no inferred or backdated consent.

The existing new-store gates remain unchanged. Private read/preflight is a
separate capability. Public token unsubscribe is not activated by this fix;
old email-address-only links do not acquire a verified identity or compatibility
with the new personal-token scheme. Provider-native legacy unsubscribe has not
been checked against previously sent mail.

Regression coverage: retired HTTP handlers and internal processor, source-level
no-provider/read/write imports, plus isolated runtime form tests for six sources
with new STORE disabled, and DOI-only behavior when enabled. No real messages.

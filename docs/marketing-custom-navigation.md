# Custom campaign link navigation

Custom ads and landing pages are always served in an opaque sandbox iframe,
including published pages. Therefore `window.self !== window.top` cannot identify
a private preview.

`customLinkBridge({preview})` installs the link handler in the child head before
campaign HTML or JavaScript. The server supplies the preview state from its
existing authenticated preview route. For HTTPS anchors:

- Published pages keep native link activation and target the top-level page. This
  retains the transient user activation required by the sandbox and prevents
  legacy campaign click handlers from showing preview dialogs.
- Private previews cancel navigation and show the configured destination in a
  keyboard-dismissable dialog. The destination is inserted as text, never HTML.
- Local `#fragment` links, ordinary buttons and non-HTTPS controls are untouched.

The iframe has no new permissions. No same-origin access, forms, popups, network
APIs or new asset origins are enabled. Newsletter rendering is unchanged.

No persisted campaign draft or published snapshot is rewritten by this fix.
Unpublished campaign changes remain private.

The sandboxed `srcdoc` document inherits its embedding page’s base URL. The
child sends height and scroll messages only to that URL’s exact origin, never
to a wildcard; an opaque or missing origin sends no message. The parent accepts
messages only from its own iframe window. The CSP continues to forbid `<base>`
changes and the iframe retains its opaque origin.

## Regression checks

- `node --test tests/marketing/link-navigation.test.mjs`
- `npx playwright test tests/e2e/marketing-frame-origin.spec.ts`
- `node tools/marketing/scripts/test-custom-navigation.mjs`

The browser check uses a local interception fixture with the original faulty
iframe-based preview handler, at 320, 375, 414, 768 and 1440 pixels. It verifies
live top-level navigation, preview destination display and dismissal, hash
navigation and an unrelated interactive control. All outgoing requests are
fulfilled locally or aborted. Set `BASELINE=1` to remove the new bridge and
reproduce the failure.

An optional JSON path argument accepts an internal array of persisted records
and exercises their `published.document` values only. Do not commit exported
records or credentials. Static images may load during that optional check;
navigation destinations are still intercepted locally.

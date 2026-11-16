# Newsletter über Resend (news.paulikreisch.de)

Status: Resend-Einbau vorhanden, neue öffentliche Newsletter-Schreibpfade und Resend-Versand gesperrt. Die private Studio-Prüfung liest Status und bestätigte Empfängerzahl ohne diese Gates zu öffnen. Der alte MailerSend-Dispatcher und der Anmelde-Fallback sind stillgelegt. Nur signierte Abmeldung ist live. Das nächste Bundle bindet den separat schaltbaren Feedback-Rückkanal ein.

## Bausteine
- Absender-Domain `news.paulikreisch.de` bei Resend (Free-Plan, Limits gelten pro Produkt). DNS bei Netcup: DKIM-TXT und zwei CNAMEs (`send.news`, `rsend.news`). Kein MX, kein Apex-DMARC.
- Empfänger: Firestore-Collection `newsletter_recipients`, ein Dokument pro Empfänger, nur über Admin SDK. Dokument-ID ist ein HMAC der Adresse (pseudonym, nicht anonym).
- Status: `pending` → `active` → `unsubscribed`, plus `suppressed` (Bounce/Complaint, dauerhaft). Altbestand in `subscribers` wird nicht migriert und gilt nicht als Einwilligung.
- Double Opt-in: `POST /api/newsletter/subscribe` → Bestätigungsmail → Seite `/nl/confirm` (Button, kein Auto-Bestätigen per GET) → `/nl/confirm/submit`.
- Abmeldung: Seite `/nl/unsubscribe` (Button), `List-Unsubscribe` mit One-Click (RFC 8058) auf `/nl/unsubscribe/one-click`.
- Webhook `POST /api/newsletter/webhook`: Svix-Signatur über den Rohtext, 5 Minuten Toleranz, idempotent. Unterdrückt bei permanentem Bounce, Complaint und Suppressed.
- Studio (m.*): Newsletter-Entwurf → "Versand prüfen" zeigt Anzahl, Absender, Betreff. Senden braucht den Digest dieser Vorschau und die getippte Phrase `SENDEN <Anzahl>`.

## Voraussetzungen vor dem Einschalten (Reihenfolge)
1. **Firestore-Rules**: am 2026-11-16 16:11 in der Konsole veröffentlicht (Stand in `firestore.rules`): `subscribers` und `newsletter_recipients` nur für Admins lesbar, alles andere unverändert. Per REST-Abruf eines nicht existierenden Dokuments geprüft: 403 für beide, 404 für `articles` und `users`. Rollback: vorherige Version im Regelverlauf der Konsole. `users` ist bewusst nicht angefasst.
2. Secrets (Secret Manager / App Hosting): `NEWSLETTER_TOKEN_SECRET` (≥32 Zeichen), `NEWSLETTER_ID_KEY` (≥32 Zeichen, nie rotieren ohne Migration, Backup im Vault), `NEWSLETTER_RESEND_API_KEY` (Sending-only, auf die Domain beschränkt; bewusst nicht `RESEND_API_KEY`, den Namen belegt schon ein vorhandenes, ungenutztes Secret, das unberührt bleibt), `NEWSLETTER_RESEND_WEBHOOK_SECRET`.
   Die Einträge in `apphosting.yaml` kommen erst, wenn die Secrets existieren, sonst scheitert der Rollout.
3. Umgebung: `NEWSLETTER_FROM`, optional `NEWSLETTER_REPLY_TO`, `NEWSLETTER_BASE_URL` (Standard https://paulikreisch.de), `NEWSLETTER_DAILY_LIMIT` (Standard 100).
4. `NEWSLETTER_STORE_ENABLED=1` schaltet die öffentliche Anmeldung und Bestätigung frei. Private Prüfung, signierte Abmeldung, Feedback und Versand haben eigene schmale Fähigkeiten und Gates.
5. Resend-Webhook auf die Webhook-URL anlegen; erst nach Signatursecret-Bindung und Abnahme aktivieren.
6. `NEWSLETTER_SEND_ENABLED=1` ist ein eigener Schalter für das tatsächliche Senden. Erster Versand nur nach ausdrücklicher Freigabe.

## Browseransicht ("Im Browser ansehen")
- Nur Newsletter mit eigenem HTML. Im HTML steht der Platzhalter `{{webansicht}}` (zusätzlich zu `{{abmeldelink}}`).
- Öffentlich wird erst, was im Studio ausdrücklich veröffentlicht wird: `https://paulikreisch.de/nl/view/<slug>` zeigt den unveränderlichen veröffentlichten Stand, nie den Entwurf. Ohne Veröffentlichung 404.
- Die Ansicht enthält keine Empfänger, keine Tokens, keine Einwilligungsdaten. Der Abmeldelink der Browseransicht führt auf die allgemeine Seite `/nl/unsubscribe`, die den persönlichen Link aus der Mail verlangt. Kein Skript, keine Formulare (CSP), `noindex`.
- Beim Versand wird `{{webansicht}}` nur ersetzt, wenn genau die aktuelle Revision veröffentlicht ist. Sonst wird der Versand verweigert (Link würde etwas anderes zeigen als die Mail).
- Gleiche Freigabeschranke wie das Studio (`MARKETING_STUDIO_RELEASE`). cid-Bilder brauchen ein Vorschaubild, sonst ist keine Veröffentlichung möglich.

## Token-Rotation
`NEWSLETTER_TOKEN_SECRET` rotieren: altes Secret nach `NEWSLETTER_TOKEN_SECRET_PREVIOUS` (kommagetrennt), neues als Hauptsecret. Bereits versendete Links bleiben gültig.

## Anmeldeformulare
Die Server-Action `subscribeToNewsletterAction` (Footer, Hero/Funnel, Shop, Shop-Seite) nutzt bei `NEWSLETTER_STORE_ENABLED=1` den Double-Opt-in-Weg. Bei ausgeschaltetem Flag meldet das Formular die Nichtverfügbarkeit. Der alte MailerSend-/Queue-Fallback ist aus Sicherheitsgründen stillgelegt. Mit Flag an entfallen der alte MailerSend-Kontakt, die Day-0-Mail und die `funnel_queue`-Einträge: vor der Bestätigung geht keine weitere Mail raus. Nach der Bestätigung geht die Day-0-Mail (Checkliste) raus, aber nur mit `NEWSLETTER_FUNNEL_DAY0=1` und ohne den Satz "Du bekommst in den nächsten Tagen noch 4 kurze Mails", weil Day 1/3/5/7 bewusst nicht gesendet werden. Day 1/3/5/7 brauchen eine Inhaltsentscheidung (u.a. "4.8 Sterne", Preisaktion "Letzte Chance", Leserzitat, kaputter Abmeldeplatzhalter).

## Offen (konkret)
- Einwilligungstext: Als Nachweis wird der Satz der Bestätigungsseite gespeichert (`CONSENT_TEXT` in `src/newsletter/doi.mjs`, identisch mit `/nl/confirm`). Die Formulare zeigen je Quelle andere Texte: Footer "Ich akzeptiere die Datenschutzerklärung und die AGB", Newsletter-Block "...stimme dem Erhalt des Newsletters zu. Einmal wöchentlich, jederzeit abbestellbar", Shop-Seite nur "Datenschutzerklärung gelesen". Der Satz "Einmal wöchentlich" steht nur dort. Der Fußtext des Newsletters ("weil du dich für den Newsletter angemeldet hast") ist ungeprüft. Keine juristische Zusicherung.
- Honeypot-Feld `website` ist in den Formularen nicht eingebaut. Die Route akzeptiert es, ohne dass es Pflicht ist.
- Zustellbarkeit ist nicht gemessen. Keine Aussage zu einzelnen Mailclients.

## Private Status- und Versandprüfung
- `m.*` stellt die Prüfung auch bei `NEWSLETTER_STORE_ENABLED` aus bereit. Die bestehende verifizierte Studio-Sitzung und CSRF-Prüfung gelten weiter.
- Ein eigener Readadapter kann nur lesen: Statuszähler und pseudonyme Empfänger-IDs für den serverseitigen Digest. Keine Adressen, Einwilligungsdaten oder persönlichen Abmeldetokens gehen an den Browser. Keine Anbieterabfrage, kein Schreiben, kein Mailversand.
- Private Entwürfe sind prüfbar. Eine unveröffentlichte/veraltete Browseransicht wird als Versandhindernis angezeigt, nicht durch Veröffentlichung umgangen. Die eigentliche Sendemethode verlangt den passenden veröffentlichten Stand, SEND, konfiguriertes Feedback, Digest und Phrase. STORE ist dafür nicht nötig.
- Das angezeigte Limit ist ein **Kampagnenlimit**, kein aufaddiertes Tagesbudget. Das verbleibende Resend-Kontingent und die Zustellbarkeit sind nicht geprüft.
- Anmeldung/DOI bleiben durch STORE gesperrt. Feedback hat einen eigenen Schalter. Die signierte Abmeldung ist getrennt, siehe unten. Der alte Funnel-Dispatcher antwortet auf GET/POST mit 410 und verarbeitet keine Queue.

## Separate removal capability
`NEWSLETTER_UNSUBSCRIBE_ENABLED=1` permits only a valid signed token to remove an
existing new-store recipient, through the manual-confirm or RFC8058 POST route.
It does not enable registration, confirmation, list reads, provider calls or
sending. Leaving STORE/SEND off must never prevent removal once this removal
capability has been explicitly activated. App Hosting enables only this removal flag. STORE/SEND/FUNNEL remain off. Malformed or incorrectly signed tokens are rejected before constructing a database adapter. The recipient transaction verifies the signature again; repeated removal is idempotent.

Old `?email=` links are not authenticated personal tokens. The page must state
that no removal happened and offer the existing contact route; never turn an
arbitrary URL address into a verified identity or a false success. Compatibility
with any previous provider-native signed links needs their original scheme and
provider support, not guessed token conversion. No legacy list was migrated.


## Private campaign capability and transport probe
Campaign sending no longer needs public registration enabled. Its server-only
capability exposes only mailable recipients and is gated by SEND. Private preview
still uses the address-free read model. A configured signed feedback gate is
required by both preview and direct campaign send. STORE and FUNNEL stay off.

The private manager-only `/api/marketing/newsletter/transport-test` supports GET
for exact review and POST for a fixed one-off technical message to
`philipp.l.paulik@gmail.com`. POST requires the existing origin/session/CSRF
checks, its own default-off `NEWSLETTER_TRANSPORT_TEST_ENABLED`, exact digest and
phrase, and the configured approved sender identity. It never calls the
newsletter store or changes the summer draft. A create-only private bucket claim
is written before provider submission. Concurrent requests and all later retries
are refused, even if the first response is lost. There is no automatic reset.
Provider acceptance does not establish inbox delivery. No activation or message
approval is implied by deploying this code.

## Scoped provider feedback
The isolated Resend webhook subscribes only to `email.bounced`,
`email.complained`, `email.suppressed`. It remains disabled until the signature
secret is safely bound and the endpoint is verified. The route uses
`NEWSLETTER_RESEND_WEBHOOK_SECRET` and the separate default-off
`NEWSLETTER_FEEDBACK_ENABLED`. It verifies the raw signed body and timestamp
before constructing any DB adapter. Only the exact configured From is accepted:
this Resend account also contains other projects. Only existing new-store records
can be suppressed, with idempotent terminal status; unknown addresses are not
created and a complaint cannot revive consent. No provider API call, list import,
confirmation or newsletter send occurs in feedback handling.

Provider payload references checked 2026-11-16:
- https://resend.com/docs/webhooks/emails/bounced
- https://resend.com/docs/webhooks/emails/complained
- https://resend.com/docs/webhooks/create-webhook
- https://resend.com/docs/api-reference/emails/send-email

Runtime binding prepared 2026-11-16: signature secret version 1 exists Enabled;
the actual App Hosting compute service account has Secret Accessor on this secret
only. This bundle pins `NEWSLETTER_RESEND_WEBHOOK_SECRET@1` and sets only
`NEWSLETTER_FEEDBACK_ENABLED=1`. The provider webhook remains disabled until live
endpoint acceptance. STORE/SEND/FUNNEL and the transport probe remain unset/off.
A configured callback and synthetic fixture acceptance do not prove real provider
event delivery or inbox delivery. No actual or test email has been sent.

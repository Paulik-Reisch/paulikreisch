# Newsletter über Resend (news.paulikreisch.de)

Status: Code vorbereitet, **alles aus**. Ohne die Flags unten liest, schreibt und sendet nichts.

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
2. Secrets (Secret Manager / App Hosting): `NEWSLETTER_TOKEN_SECRET` (≥32 Zeichen), `NEWSLETTER_ID_KEY` (≥32 Zeichen, nie rotieren ohne Migration, Backup im Vault), `RESEND_API_KEY` (Sending-only, auf die Domain beschränkt), `RESEND_WEBHOOK_SECRET`.
   Die Einträge in `apphosting.yaml` kommen erst, wenn die Secrets existieren, sonst scheitert der Rollout.
3. Umgebung: `NEWSLETTER_FROM`, optional `NEWSLETTER_REPLY_TO`, `NEWSLETTER_BASE_URL` (Standard https://paulikreisch.de), `NEWSLETTER_DAILY_LIMIT` (Standard 100).
4. `NEWSLETTER_STORE_ENABLED=1` schaltet Store, Anmeldung, Bestätigung, Abmeldung, Webhook und Studio-Panel frei.
5. Resend-Webhook auf die Webhook-URL anlegen, erst wenn die Route live ist.
6. `NEWSLETTER_SEND_ENABLED=1` ist ein eigener Schalter für das tatsächliche Senden. Erster Versand nur nach ausdrücklicher Freigabe.

## Token-Rotation
`NEWSLETTER_TOKEN_SECRET` rotieren: altes Secret nach `NEWSLETTER_TOKEN_SECRET_PREVIOUS` (kommagetrennt), neues als Hauptsecret. Bereits versendete Links bleiben gültig.

## Anmeldeformulare
Die Server-Action `subscribeToNewsletterAction` (Footer, Hero/Funnel, Shop, Shop-Seite) nutzt bei `NEWSLETTER_STORE_ENABLED=1` den Double-Opt-in-Weg. Bei ausgeschaltetem Flag bleibt der bisherige Weg unverändert. Mit Flag an entfallen der alte MailerSend-Kontakt, die Day-0-Mail und die `funnel_queue`-Einträge: vor der Bestätigung geht keine weitere Mail raus. Die Funnel-Mails (Checkliste) laufen damit nicht mehr automatisch. Das ist eine Entscheidung für Philipp, falls der Funnel sie braucht.

## Offen (konkret)
- Einwilligungstext: Als Nachweis wird der Satz der Bestätigungsseite gespeichert (`CONSENT_TEXT` in `src/newsletter/doi.mjs`, identisch mit `/nl/confirm`). Die Formulare zeigen je Quelle andere Texte: Footer "Ich akzeptiere die Datenschutzerklärung und die AGB", Newsletter-Block "...stimme dem Erhalt des Newsletters zu. Einmal wöchentlich, jederzeit abbestellbar", Shop-Seite nur "Datenschutzerklärung gelesen". Der Satz "Einmal wöchentlich" steht nur dort. Der Fußtext des Newsletters ("weil du dich für den Newsletter angemeldet hast") ist ungeprüft. Keine juristische Zusicherung.
- Honeypot-Feld `website` ist in den Formularen nicht eingebaut. Die Route akzeptiert es, ohne dass es Pflicht ist.
- Zustellbarkeit ist nicht gemessen. Keine Aussage zu einzelnen Mailclients.

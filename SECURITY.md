# Sicherheit

Sicherheitsprobleme vertraulich an den im Impressum genannten Kontakt melden. Keine Zugangsdaten oder personenbezogenen Daten in öffentlichen Issues.

## Technische Kontrollen

- Abhängigkeiten: Lockdatei, npm audit und Dependabot; kein automatisches Mergen.
- Sessions: mindestens 32 Zeichen langes `SESSION_SECRET`, signierte JWTs, Ablauf- und Strukturprüfung.
- CI benötigt keine Produktionsgeheimnisse. Der Vorschau-Modus erzeugt keine anonymen Firebase-Konten und sendet keine Seitenaufrufe.

## Bestehende Backend-Risiken

Das Redesign ist keine Freigabe des bestehenden Backends. Die vorhandenen Firestore-Regeln und die Klartext-Adminzugänge erfordern eine separate Migration zu Firebase Auth / rollenbasierten Regeln und einem serverseitigen Datenzugriff. Die vorhandenen Datenbankregeln wurden nicht ungetestet geändert, da dies bestehende Funktionen sperren könnte.

Die Newsletter-Gruppenfunktionen verwenden eine im MailerSend-SDK nicht vorhandene API. Gruppenbasierter Kampagnenversand bleibt explizit gesperrt, bis ein unterstützter Listenanbieter angebunden ist. Die bestehende Firestore-Speicherung bleibt erhalten. Ein vollständiger Double-Opt-in-Prozess ist separat zu prüfen.

GitHub: Secret Scanning / Push Protection und Branch Protection aktivieren, sofern der Tarif sie unterstützt. Änderungen an Cloud-Regeln, Konten und Secrets erfordern eine gesonderte Freigabe.

## Security-Workflow im privaten Repository

`.github/workflows/security.yml` läuft für Pull Requests, Pushes nach `main`, wöchentlich und manuell. Er ersetzt den bisherigen CodeQL-Workflow, der private Repositories bedingungslos übersprungen hat.

- `Production dependency audit`: installiert die Lockdatei ohne Lifecycle-Skripte und blockiert bei hohen/kritischen Meldungen in Produktionsabhängigkeiten. Tailwind 3 bleibt ein Build-Werkzeug; dessen bekannte transitive Entwicklungsabhängigkeitsrisiken sind nicht behoben.
- `Semgrep source and secret scan`: Semgrep Community Edition 1.180.0 mit den gepflegten Regelpaketen `p/default` und `p/secrets` gegen `src`. Findings und Scanfehler lassen den Job fehlschlagen. Der SARIF-Bericht liegt sieben Tage als privates Actions-Artefakt `semgrep-results` vor; er wird nicht in GitHub Code Scanning hochgeladen.
- Kein Semgrep-Account oder Token nötig. Die Regelpakete werden heruntergeladen; Quellcode wird lokal im Actions-Runner gescannt, Telemetrie und Versionsprüfung sind abgeschaltet.

Diese Prüfungen ersetzen keine Prüfung der Firestore-Regeln, Cloud-Berechtigungen oder bestehenden Admin-Daten. Ein grüner Lauf ist keine vollständige Backend-Sicherheitsfreigabe.

Vor dem Merge sollten in den GitHub-Regeln `quality`, `Production dependency audit` und `Semgrep source and secret scan` als erforderliche Checks hinterlegt werden. Workflows allein verhindern kein manuelles Mergen roter Checks.

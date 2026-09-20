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

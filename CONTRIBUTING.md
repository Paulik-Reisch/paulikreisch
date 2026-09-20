# Mitwirken

Node.js 22 verwenden, `npm ci` ausführen und einen eigenen Branch anlegen.
`npm run dev:preview` startet eine lokale Vorschau ohne automatische Firebase-Anmeldung und Analytics-Schreibzugriffe.
Formulare können weiterhin Serveraktionen auslösen; keine echten Anmeldungen oder Kampagnen zu Testzwecken absenden.

Vor einem Pull Request: `npm run check`, `npm run build`, `npm run test:e2e` und `npm audit`.
UI-Änderungen bei 320, 375, 414, 768 und 1440 Pixeln prüfen. Tastaturbedienung und reduzierte Bewegung berücksichtigen.
Deutsche sichtbare Texte, semantisches HTML, serverseitige Inhalte und kleine Client-Komponenten bevorzugen.
Header-/Footer-Inhalte nur nach ausdrücklicher Freigabe ändern. Keine erfundenen Testimonials, Kennzahlen oder Suchmaschinenversprechen.

Keine Secrets, personenbezogenen Daten oder lokale `.env`-Dateien committen. Sicherheitsfunde nicht in öffentlichen Issues veröffentlichen.
Kein automatisches Mergen oder Deployment: Änderungen werden zuerst überprüft.

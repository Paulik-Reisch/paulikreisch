# Startseite: Gestaltung, Rückkehr und Suchmaschinen

## Gestaltung

Newsprint-inspirierte Literaturseite: Papier, dunkle Druckfarbe, vorhandenes Gelb und warme Akzente. Bestehende Buchbilder und vorhandene Autorenillustrationen. Buch, Worthaft, Autoren und lesbare Antworten bilden eigenständige Bereiche. Desktop-Parallax ist eine optionale Verbesserung; Inhalte bleiben ohne JavaScript vollständig sichtbar. Bei reduzierter Bewegung entfällt Parallax.

Die Inhalte von Header und Footer bleiben unverändert. Die Startseite nutzt dieselben Komponenten. Schrift- und Farbvariablen in `tokens.css` sind auf `.pr-home` begrenzt.

## Sicherung

`/index-old` zeigt die frühere Komposition mit den erhaltenen Komponenten. `noindex, nofollow` verhindert eine konkurrierende Archivseite im Suchindex. Die Route ist nicht in der Sitemap. Die ursprüngliche Quelldatei liegt unter `docs/archive/index-old/page.tsx.txt`; `baseline.json` enthält den ursprünglichen Git-Commit und Prüfsummen. Die exakte frühere Gesamtversion kann aus diesem Commit in einen separaten Git-Worktree ausgecheckt werden. Die Archivroute verwendet weiterhin gemeinsam genutzte Komponenten und ist deshalb kein unveränderlicher Screenshot.

Für eine Rückkehr nur der Startseite: Inhalt der archivierten Textdatei wieder nach `src/app/page.tsx` kopieren und die dort vorhandenen alten Metadatentypen an die aktuelle Next.js-Version anpassen. Für eine vollständige Rückkehr den dokumentierten Git-Commit verwenden.

## SEO, AEO und GEO

- Deutsches HTML, eindeutige H1, zugängliche Überschriftenhierarchie und interne Verlinkung.
- Absolute Canonical-URL, Open Graph, Twitter Card und serverseitige Inhalte.
- Vorhandene CMS-Metadaten werden weiterhin gelesen. Bei Fehler oder Verzögerung greifen lokale Standardwerte.
- JSON-LD für WebPage, Book und die tatsächlich sichtbaren Fragen/Antworten. Keine erfundenen Bewertungen oder Preisangebote.
- `robots.txt` enthält eine gültige Sitemap-URL ohne angehängten Erklärungstext.
- `llms.txt` bleibt ein ergänzendes Inhaltsverzeichnis, kein Rankingmechanismus.

Quellen: [Google: AI features](https://developers.google.com/search/docs/appearance/ai-features), [Google: Structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data). Strukturierte Daten müssen zum sichtbaren Inhalt passen. Weder FAQ-Markup noch spezielle KI-Dateien garantieren Rankings oder Erwähnungen.

## Repository

CI prüft Lint, TypeScript, Tests, Produktionsbuild, Abhängigkeiten und Browserdarstellung. Dependabot bereitet Updates vor. CodeQL läuft für öffentliche Repositories; private benötigen eine entsprechende GitHub-Lizenz. CODEOWNERS weist Reviews zu. Die Dateien werden mit dem freigegebenen Push aktiviert. Branch Protection und übrige GitHub-Einstellungen bleiben unverändert. Der Rollout erfolgt über das vorhandene Firebase-App-Hosting-Backend `studio`. Ein neuer, ausdrücklich freigegebener Sitzungsschlüssel liegt im Secret Manager; `apphosting.yaml` enthält ausschließlich die Referenz auf Version 1.

## Weitere Korrekturen

Firestore-Lesezugriffe legen keine Standardartikel, Autoren, Seiten, Exzerpte oder Countdown-Einstellungen mehr in der Produktionsdatenbank an. Vorhandene Daten bleiben unverändert. Statische Sitemap-Einträge erfinden keinen aktuellen Änderungszeitpunkt mehr; ungültige Datumswerte werden weggelassen.

Die Overrides für PostCSS (Next.js) und UUID (gaxios) schließen Sicherheitslücken ohne Next.js-Majorupgrade. Sie können entfallen, sobald die übergeordneten Pakete sichere Versionen direkt unterstützen.

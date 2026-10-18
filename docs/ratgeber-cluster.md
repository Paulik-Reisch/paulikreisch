# Ratgeber: Redaktion, Cluster und strukturierte Daten

## Umfang und Ziel

Die zehn vorhandenen Themenwelten sind vollständig ausgebaut: 119 eigenständige Unterseiten entsprechen den Slugs aus den bisherigen Cluster-Plänen. `src/lib/ratgeber/cluster-plan.json` hält diese ursprüngliche Soll-Liste fest. Die internen Planungs- und Promo-Tabellen sind durch lesbare Themenüberblicke ersetzt.

Die Übersicht, alle zehn Pillars und alle Unterseiten verwenden die Papierfarben, Schrifttypen und zurückhaltende redaktionelle Gestaltung der Startseite. Header und Footer bleiben inhaltlich unverändert. Es wurden keine Abhängigkeiten ergänzt.

## Inhalte bearbeiten

- `src/lib/ratgeber/content/<pillar>.json`: eigenständige Artikel mit Titel, Beschreibung, Kurzantwort, Abschnitten, Beispielen, FAQs und gegebenenfalls Originalquellen.
- `src/lib/ratgeber/pillars.ts`: verständliche Themenbeschreibungen, Querverbindungen und tatsächlicher Überarbeitungsstand.
- `src/lib/ratgeber/registry.ts`: gemeinsame Routen- und Inhaltsquelle. Die XML-Sitemap übernimmt alle Pillar- und Artikelpfade daraus.
- `src/components/ratgeber/guide-page.tsx`: servergerenderte Darstellung; sichtbare FAQs und JSON-LD beziehen sich auf dieselben Inhalte.

Neue Artikel zuerst inhaltlich verfassen und prüfen, dann im Plan ergänzen. Jede Seite soll eine eigene Frage beantworten; keine austauschbaren Füllabsätze. Geänderte Sachangaben anhand einschlägiger Originalquellen prüfen. Beispiele und humorvolle Übersetzungen von belegten Aussagen unterscheiden. Bei rechtlichen Fragen keine bundesweit gültigen Schwellenwerte, Fristen oder Übermittlungswege behaupten, wenn sie vom Einzelfall abhängen.

Die ursprünglich geplante Schreibweise `regeln-ampe-inacht` bleibt als URL erhalten. Der sichtbare Titel ist verständlich formuliert. Vorhandene Wiki- und Magazin-URLs wurden nicht umgeleitet oder gelöscht. Für nicht existierende Cluster gibt es eine echte 404-Antwort.

## SEO, AEO und Semantik

Jede Seite hat eine einzige Hauptüberschrift, eine eigene kanonische URL und einen absoluten Seitentitel ohne doppelte Markennennung. Breadcrumbs, lesbare Abschnittsanker, Inhaltsverzeichnisse und Links zwischen Überblick und Vertiefungen bilden den Themenzusammenhang ab. Kurze Antworten stehen vor längeren Erklärungen. Tabellen haben Überschriften und bei Bedarf eine fokussierbare Scrollregion; FAQs lassen sich ohne JavaScript öffnen.

Die Übersicht und Pillars sind `CollectionPage` mit `ItemList`. Unterseiten verwenden `WebPage`, `Article`, `BreadcrumbList` und für tatsächlich vorhandene Fragen `FAQPage`. JSON-LD wird gegen Script-Terminierung escaped. Veröffentlichungsdaten, Bildbelege oder individuelle Fachqualifikationen werden nicht erfunden. Der Anbieter wird als Organisation angegeben; redaktionelle Prüfung bleibt vor Veröffentlichung sinnvoll.

Strukturierte Daten sind eine maschinenlesbare Beschreibung, keine Zusage für Rankings, KI-Zitate oder Rich Results. Insbesondere wird keine besondere Darstellung von FAQ-Einträgen in Google versprochen. Referenzen: [Google: Article](https://developers.google.com/search/docs/appearance/structured-data/article), [Schema.org: CollectionPage](https://schema.org/CollectionPage), [Google-Dokumentationsänderungen](https://developers.google.com/search/updates).

## Prüfungen

`npm run check`, `npm run build`, `npm run test:e2e` und `npm audit` entsprechen den Projektvorgaben. Die Ratgeber-Tests prüfen die exakte 119er-Abdeckung, eindeutige Slugs und Abschnittsanker, sinnvolle Mindestumfänge, fehlende längere Textduplikate, interne Links, FAQ-/Schema-Übereinstimmung und sichere Serialisierung.

Die Browser-Tests rufen sämtliche 119 Artikel ab und prüfen Canonical, Statuscode, Hauptüberschrift und FAQ-Daten. Übersicht, Pillar und Artikel werden bei 320, 375, 414, 768 und 1440 Pixeln geprüft; zusätzlich Navigation, Sitemap, 404, Nutzung ohne JavaScript und automatisierte Barrierefreiheit.

Die Abhängigkeitsprüfung meldet unverändert zehn bestehende Funde (sieben hoch, drei moderat). Dieser Ausbau verändert weder Paketdateien noch Lockfile. Build-Warnungen zu React, Middleware und lokalem Firebase-Fallback stammen aus dem vorhandenen Projekt.

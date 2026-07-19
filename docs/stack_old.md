# Stack (alt) — wie es mit Firebase Studio lief

**Kurz gesagt:** Früher hat *ein einziger Dienst* (Firebase Studio von Google) alles
gemacht. Code schreiben, speichern, bauen, veröffentlichen — alles an einem Ort im
Browser. Ihr musstet euch um nichts kümmern.

---

## Was Firebase Studio genau war

Firebase Studio war eine **Cloud-IDE** (eine Entwickler-Umgebung, die komplett im
Browser läuft). Man hat es im Browser geöffnet, wie Google Docs, und konnte dort:

- Code schreiben (wie in einem Texteditor, nur für Programmcode)
- Den Code sofort testen (Vorschau im Browser)
- Die Seite mit einem Klick veröffentlichen
- Die Datenbank (Firestore) und den Speicher (Storage) verwalten

Man hat **nichts auf dem eigenen Computer** installiert. Alles lief auf Googles
Servern.

---

## Der alte Stack in einer Grafik (vereinfacht)

```
   DU (Browser)
        │
        ▼
 ┌─────────────────────────┐
 │   Firebase Studio        │  ← Google macht ALLES
 │  (Cloud-IDE im Browser)  │
 │                          │
 │  • Code schreiben        │
 │  • App bauen (Build)     │
 │  • App veröffentlichen    │
 │  • Firebase DB + Storage  │  ← bleibt auch weiterhin!
 └─────────────────────────┘
        │
        ▼
   paulikreisch.de  (Live-Seite)
```

**Der Clou:** Firebase Studio hat das "Bauen & Veröffentlichen" (Deployment) für euch
übernommen. Ihr habt den Knopf gedrückt, Google hat den Rest gemacht.

---

## Was dabei gut war

- Keine Installation, kein Terminal, kein "la Local Setup" nötig
- Man sah sofort, was man gebaut hat
- DB + Speicher + Code an einem Ort

## Was das Problem war

- Google **stellt Firebase Studio ein** (Sunset) → ihr müsst weg
- Ihr hattet **keine echte Versionskontrolle** (kein "Zurück zur alten Version")
- Wenn Google den Stecker zieht, seid ihr ohne Plan, wo euer Code liegt
- Zwei Leute (du + Max) konnten nicht sauber *parallel* arbeiten

---

## Wichtig: Was BLEIBT bei Google

Nur die **Cloud-Infrastruktur** bleibt bei Firebase — das ist separat vom Studio:

| Bleibt bei Firebase | Was das ist |
|---------------------|-------------|
| **Firestore** (DB) | eure Datenbank (Artikel, Autoren, Newsletter, Logs) |
| **Firebase Storage** | eure Bilder/Dateien |
| **Firebase App Hosting** | der Dienst, der die Seite ins Netz stellt |
| **Domain** `paulikreisch.de` | läuft weiter über Firebase |

Das heißt: **Nur die "Schreib-Maschine" (Studio) fällt weg — nicht eure Daten.**

Im nächsten Schritt (`stack.md`) erkläre ich, wie der neue Stack aussieht, bei dem
GitHub + Claude Code die Arbeit von Firebase Studio übernehmen.

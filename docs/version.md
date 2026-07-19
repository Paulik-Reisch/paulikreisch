# Version — wie ihr mit Versionen umgeht

**Kurz gesagt:** Jede veröffentlichte Version bekommt eine **Nummer** (z. B.
`v1.4.0`). Das hilft euch zu wissen: "Wann kam was rein?" und "Wie komme ich zur
alten Version zurück?". GitHub merkt sich ohnehin jede Änderung — ihr müsst nur
ordentlich beschriften.

---

## Was ist eine Version?

Eine Version ist wie eine **Ausgabe** einer Zeitschrift. Ihr zählt hoch:

```
v1.0.0   ← erste richtige Version
v1.1.0   ← neue Funktion dazu
v1.1.1   ← kleiner Fehler behoben
v2.0.0   ← großer Umbau
```

Das Schema heißt **Semantic Versioning** (SemVer):
`[große Änderung].[neue Funktion].[Fehlerfix]`

Für euch als Zwei-Mann-Team reicht es, einfach hochzuzählen: `v1`, `v2`, `v3` …

---

## Woher kommen die Versionen? (GitHub Releases)

GitHub kann **"Releases"** — das sind beschriftete Schnappschüsse eures Codes.

```
git tag v1.2.0          # Marke setzen
git push origin v1.2.0  # hochladen
→ GitHub zeigt "Release v1.2.0" mit Datum + Änderungen
```

Später könnt ihr sagen: "Zeig mir v1.1.0" und habt exakt diesen Stand.

---

## Empfohlener Alltag (einfach gehalten)

Ihr müsst **nicht** bei jeder kleinen Änderung versionieren. Macht das so:

| Anlass | Version |
|--------|---------|
| Kleiner Text/Button geändert | kein Release nötig, nur Commit |
| Neue Seite / neues Feature | `vX.Y.0` Release |
| Fehler, der live war, behoben | `vX.Y.Z` Release |
| Komplett-Umbau | `vX.0.0` Release |

**Regel:** Ein Release = ein Moment, auf den ihr zeigen könnt: "Das ist ein
fertiger Stand."

---

## Changelog (für eure Besucher / euch)

Legt eine einfache Liste im Repo an (z. B. `docs/changelog.md` oder direkt bei
GitHub Releases). Beispiel:

```
## v1.2.0 — 2026-07-20
- Worthaft: Popup bei gewonnenem Wort
- Startseite: neuer Hero-Text
- Fix: Favicon-Build-Fehler behoben
```

Das ist Gold wert, wenn ihr später vergessen habt, was wann kam.

---

## Zurückrollen (Rollback)

Wenn eine Version live schiefgeht:

```bash
# Zur letzten guten Version springen
git checkout v1.1.0
firebase deploy
```

Oder in Firebase App Hosting: dort gibt es meist einen "Rollback"-Knopf pro Deploy.
Weil Firebase App Hosting jeden Build speichert, ist das oft nur ein Klick.

---

## Zusammenfassung

- Jede Änderung = automatisch in GitHub gesichert (kein Datenverlust mehr!)
- Große Meilensteine = Version mit Tag (`v1.2.0`)
- Live-Fehler = zurück zur letzten Version
- Changelog schreiben = ihr versteht in 6 Monaten noch, was passiert ist

Siehe `publish.md` (wie man live schaltet) und `collaborate.md` (wie ihr gemeinsam
arbeitet).

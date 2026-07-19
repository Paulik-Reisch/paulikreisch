# Max, so klappts — Einsteiger-Leitfaden für dich

**Hey Max,** das hier ist für dich geschrieben. Keine Panik vor Fachbegriffen — ich
erklär dir exakt, wo was liegt und wie du ganz ohne Terminal Änderungen machen kannst.
Du musst **keinen Code schreiben** und **nichts installieren**, wenn du nicht willst.

---

## 1. Wo liegt was? (Die drei Orte)

Stell dir das wie drei verschiedene "Schubladen" vor:

```
┌─────────────────────────────────────────────────────────────┐
│ ① QUELLCODE (der Bauplan der Seite)                          │
│    → liegt auf GITHUB                                        │
│    → https://github.com/Paulik-Reisch/paulikreisch           │
│    → das ist unser gemeinsamer "Cloud-Ordner" für den Code   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ② DIE APP / LIVE-SEITE (was Besucher sehen)                  │
│    → liegt bei FIREBASE APP HOSTING                          │
│    → paulikreisch.de (live) + dev.paulikreisch.de (test)     │
│    → Firebase baut die Seite aus dem Code und stellt sie ins │
│      Netz                                                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ③ DATENBANK + BILDER (Inhalte)                               │
│    → bleibt bei FIREBASE (Firestore + Storage)               │
│    → Artikel, Autoren, Newsletter, Logs = Firestore (DB)     │
│    → Bilder/Dateien = Firebase Storage                       │
│    → das ändert sich NICHT, alles weiter dort                │
└─────────────────────────────────────────────────────────────┘
```

**Deine Frage: "Also Bilder und Datenbank weiterhin dort updaten?"**
→ **Ja, genau.** Bilder und Datenbank bleiben bei Firebase. Wenn du ein Bild
hochlädst oder einen Artikel in der DB änderst, machst du das weiterhin dort, wo
du es bisher gemacht hast (Firebase bzw. unser Admin-Bereich). Das trennt sich
nicht vom Code.

---

## 2. Deine Frage: "Gibt's da auch ein Interface / KI-Tool?"

**Ja, gibt's — und zwar mehrere. Du brauchst kein Terminal.**

### A) Hermes (Philipp empfiehlt dir das) — am einfachsten
Hermes ist ein KI-Chat-Programm (Desktop-App), das Philipp nutzt. Du installierst
es dir auch, und dann sagst du einfach auf Deutsch, was du willst:
- *"Ändere den Text auf der Über-Seite"*
- *"Mach den Newsletter-Button größer"*
- *"Lade das neue Buch-Cover hoch"*

Hermes erledigt den Rest (Code schreiben + zu GitHub speichern). Du schaust drüber
und sagst okay. **Das ist der Einsteiger-Weg für dich.**

### B) GitHub Antigravity (KI-IDE im Browser)
Das ist wie Firebase Studio, nur auf GitHub-Basis. Du öffnest es im Browser,
verbindest es mit unserem Repo, und die KI schreibt den Code für dich — genau wie
früher bei Firebase Studio. Keine Installation nötig.

### C) Admin-Bereich der Seite (für Inhalte)
Für Artikel, Autoren, Bilder etc. gibts ohnehin unser Admin-CMS auf der Seite
selbst (`/admin`). Da kannst du Inhalte per Klick pflegen — das ist keine
"Programmierung", sondern einfach Eingabeformulare.

---

## 3. Wie machst du Änderungen per GitHub? (3 Wege)

### Weg 1 — Hermes (empfohlen für dich)
1. Hermes öffnen
2. Sagen, was du willst (auf Deutsch)
3. Hermes zeigt's, du sagst "ja"
4. Fertig — Hermes hat es zu GitHub gepusht

### Weg 2 — GitHub Antigravity (Browser)
1. Antigravity öffnen → mit GitHub verbinden
2. Repo `Paulik-Reisch/paulikreisch` öffnen
3. KI sagen: "Ändere X zu Y"
4. KI zeigt Vorschau, du sagst ok
5. KI speichert es (Commit + Push)

### Weg 3 — klassisch (nur falls du es mal willst)
Philipp macht das per Terminal mit `git`. Du musst das nicht können — die KI
(Claude Code / Hermes / Antigravity) macht `git add / commit / push` für dich.

---

## 4. Der Ablauf in echt (vereinfacht)

```
DU (Max)                  PHILIPP
  │                          │
  │ "Text ändern"            │ "Build fixen"
  ▼                          ▼
HERMES / ANTIGRAVITY    CLAUDE CODE
  │  (schreibt Code)         │  (schreibt Code)
  ▼                          ▼
  └──────┬───────────────────┘
         ▼
     GITHUB (beide speichern hier)
         ▼
     FIREBASE (baut + stellt live)
         ▼
     paulikreisch.de
```

Ihr arbeitet beide im **gleichen GitHub-Projekt**. Jeder an seinem Teil. GitHub
führt das zusammen. Keiner überschreibt den anderen.

---

## 5. Was du NICHT tun musst

- ❌ Kein Terminal öffnen
- ❌ Kein `git` lernen
- ❌ Keine Firebase-CLI installieren
- ❌ Keine Programmiersprache lernen

Du sagst der KI, was soll, und schaust drüber. Fertig.

---

## 6. Erste Schritte für dich

- [ ] **Hermes installieren** (Philipp schickt dir den Link) → KI-Chat, sagt ihm einfach, was du willst
- [ ] **ODER** GitHub Antigravity ausprobieren (Browser, KI-IDE)
- [ ] **GitHub-Account** haben (Philipp fügt dich zum Repo `Paulik-Reisch/paulikreisch` hinzu)
- [ ] Eine kleine Test-Änderung mit der KI machen (z. B. einen Text ändern)
- [ ] Schauen, ob es auf `dev.paulikreisch.de` erscheint

---

## 7. Bei Fragen

- **Inhalt/Bilder/DB:** weiter bei Firebase (Firestore/Storage) oder im Admin-CMS
- **Code/Text der Seite:** sag es Hermes oder Antigravity, die machen's
- **Du bist unsicher?** Frag Philipp oder schreib mir (Hermes) — lieber einmal zu
  viel fragen als was kaputt machen.

---

© Paulik & Reisch — gebaut von Philipp, erklärt von Hermes 💜

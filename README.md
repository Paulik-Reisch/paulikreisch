# Paulik & Reisch

Deutsche Website für satirische Literatur, das Magazin und das tägliche Worträtsel **Worthaft**.
Next.js 15 · React · TypeScript · Tailwind CSS · Firebase · Firebase App Hosting.

## Lokal starten

Voraussetzung: Node.js 22 und npm.

```sh
npm ci
npm run dev:preview
```

Die Vorschau läuft unter **http://localhost:9002**. Dieser Modus deaktiviert automatische Firebase-Anmeldungen und Analytics-Schreibzugriffe. Öffentliche Inhalte können weiterhin aus Firebase gelesen werden. Formulare und Admin-Aktionen nicht gegen Produktionsdaten testen.

Für eine vollständige lokale Umgebung `.env.example` nach `.env.local` kopieren und benötigte Werte lokal setzen. `npm run dev` startet den regulären Entwicklungsmodus. Zugangsdaten gehören weder in Git noch in öffentliche Issues.

## Qualität

```sh
npm run check        # ESLint, TypeScript, Unit- und Architekturtests
npm run build        # vollständiger Produktionsbuild mit Typprüfung
npx playwright install chromium
npm run test:e2e     # responsive Darstellung, Tastatur, SEO, A11y, Archiv
npm audit
```

Browserprüfungen verwenden 320, 375, 414, 768 und 1440 Pixel. Berichte liegen lokal in `playwright-report/`, Screenshots in `test-results/`; beides wird nicht eingecheckt. Die bestehende Codebasis enthält noch Lint-Warnungen außerhalb der neuen Startseite; Fehler brechen CI ab.

## Struktur

| Bereich | Ort |
| --- | --- |
| Neue Startseite | `src/app/page.tsx`, `src/components/home/` |
| Inhalte und Suchmetadaten | `src/lib/home-content.ts`, `src/lib/home-seo.ts` |
| Lokale Startseiten-Designtokens | `tokens.css` |
| Bisherige Startseite | `/index-old`, Originaldatei unter `docs/archive/index-old/` |
| Gemeinsamer Header und Footer | `src/components/landing/` |
| Buchshop / Magazin / Wortspiel | `src/app/shop`, `src/app/a`, `src/app/worthaft` |
| Redaktion und Administration | `src/app/admin`, `src/components/admin` |
| Datenzugriff | `src/lib/firestore.ts`, `src/firebase/` |
| Tests | `tests/unit`, `tests/e2e` |

Die neue Startseite wird serverseitig ausgegeben. Nur Navigation, Formulare und optionale Desktop-Bewegung benötigen Client-JavaScript. Die bisherigen Header-/Footer-Inhalte bleiben erhalten. `/index-old` ist mit `noindex` versehen und steht nicht in der Sitemap. Der Ausgangscommit ist für eine vollständige Wiederherstellung dokumentiert.

## GitHub und Deployment

- **Quality** prüft Code, Typen, Build, Abhängigkeiten und Browserdarstellung.
- **Dependabot** bereitet wöchentlich Paket- und Actions-Updates vor.
- **CodeQL** ist für öffentliche Repositories vorbereitet; private benötigen GitHub Code Security.
- **CODEOWNERS**, Pull-Request-Vorlage und Fehlerformular strukturieren Änderungen.

Die Konfiguration wird durch den Push aktiv. Branch Protection sollte die `quality`-Prüfung und einen Review verlangen. Die Quality-Workflow-Datei selbst deployt nicht; die bestehende Firebase-GitHub-Anbindung kann Änderungen an `main` veröffentlichen. Kein automatisches Mergen von Updates.

Das Projekt verwendet Firebase App Hosting. Ein lokaler erfolgreicher Build ist keine Backend-Sicherheitsfreigabe: Die bestehenden offenen Firestore-Regeln und Klartext-Adminzugänge bleiben bekannte Backend-Risiken und erfordern eine eigene Migration. `NEXT_PUBLIC_LOCAL_PREVIEW` darf im Produktionsdeployment nicht aktiviert sein. Ein gültiges `SESSION_SECRET` mit mindestens 32 Zeichen ist für Admin-Sessions erforderlich.

## Dokumentation

- [Gestaltung, Archiv und SEO/AEO/GEO](docs/startseite-redesign.md)
- [Entwicklung und Beiträge](CONTRIBUTING.md)
- [Sicherheit und bekannte Freigabeblocker](SECURITY.md)

## Rechte

© Paulik & Reisch. Alle Rechte vorbehalten. Inhalte, Buchmaterial und Bilder dürfen nicht ohne Genehmigung weiterverwendet werden.

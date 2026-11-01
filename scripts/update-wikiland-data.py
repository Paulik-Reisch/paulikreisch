"""Refresh Wikiland's curated, offline German Wikipedia excerpts.

Usage: python scripts/update-wikiland-data.py
Only contacts the public read-only MediaWiki API. No packages required.
Text excerpts and adaptations are CC BY-SA 4.0; see docs/wikiland-sources.md.
"""

from datetime import datetime, timezone
from pathlib import Path
import json
import re
import time
import unicodedata
from urllib.parse import urlencode, quote
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
API = "https://de.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "WikilandContentBuilder/1.0 (https://paulikreisch.de/game-labs/wikiland; public Wikipedia excerpts)"}
TOPICS = [
    ("Regenbogen", "Natur"), ("Vulkan", "Erde"), ("Photosynthese", "Wissenschaft"),
    ("Schach", "Kultur"), ("Bienen", "Natur"), ("Nordsee", "Geografie"),
    ("Eiffelturm", "Bauwerke"), ("Buchdruck", "Geschichte"), ("Schokolade", "Alltag"),
    ("Fahrrad", "Technik"), ("Papier", "Alltag"), ("Mikroskop", "Wissenschaft"),
    ("Pinguine", "Natur"), ("Mond", "Weltraum"), ("Kompass", "Technik"),
    ("Gitarre", "Musik"), ("Demokratie", "Gesellschaft"), ("Pyramide (Bauwerk)", "Bauwerke"),
    ("Gletscher", "Erde"), ("Ozean", "Geografie"), ("Schall", "Wissenschaft"),
    ("Planet", "Weltraum"), ("Magnetismus", "Wissenschaft"), ("Fledermäuse", "Natur"),
    ("Kartoffel", "Alltag"), ("Brücke", "Bauwerke"), ("Eisenbahn", "Technik"),
    ("Schmetterlinge", "Natur"), ("Sonne", "Weltraum"), ("Wüste", "Geografie"),
    ("Fußball", "Sport"), ("Seide", "Alltag"),
]


def slug(title):
    ascii_title = title.lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss")
    ascii_title = unicodedata.normalize("NFKD", ascii_title).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_title).strip("-")


def paragraphs(extract):
    result = []
    total = 0
    for block in extract.split("\n"):
        # The plain-text API omits references but can contain section titles,
        # layout whitespace and pronunciation transcriptions.
        block = re.sub(r"\[\d+(?:[,–-]\d+)*\]", "", block)
        block = re.sub(r"\[(?:[^\]\n]*[ˈˌːəɛɪɔʊɐŋʃʒθðɹɜɒæɑɡɲɣʁçɥɯ][^\]\n]*)\]", "", block)
        block = re.sub(r"\s+", " ", block).strip()
        block = re.sub(r",\s*\)", ")", block)
        block = re.sub(r"\(\s*\)", "", block)
        count = len(block.split())
        if count < (12 if not result else 32) or "=" in block or not re.search(r"[.!?]", block):
            continue
        # Preserve whole paragraphs, never cut a sentence mid-way. Extremely
        # long source paragraphs are skipped to keep article sizes manageable.
        if count > 300:
            continue
        if total + count > 650 and len(result) >= 4:
            break
        result.append(block)
        total += count
        if len(result) >= 8 or (len(result) >= 4 and total >= 350):
            break
    if total < 150 or len(result) < 4:
        raise ValueError(f"Not enough usable prose: {len(result)} paragraphs / {total} words")
    return result


def fetch(title):
    parameters = {"action": "query", "format": "json", "formatversion": "2", "prop": "extracts|revisions",
                  "explaintext": "1", "exsectionformat": "plain", "rvprop": "ids", "redirects": "1", "titles": title}
    for attempt in range(3):
        try:
            with urlopen(Request(f"{API}?{urlencode(parameters)}", headers=HEADERS), timeout=35) as response:
                page = json.load(response)["query"]["pages"][0]
            if "missing" in page:
                raise ValueError(f"Missing Wikipedia article: {title}")
            return page
        except OSError:
            if attempt == 2:
                raise
            time.sleep(2 ** attempt)


def main():
    articles = []
    source_titles = {}
    for title, category in TOPICS:
        page = fetch(title)
        revision = page["revisions"][0]["revid"]
        article = {"id": slug(page["title"]), "title": re.sub(r"\s+\([^()]+\)$", "", page["title"]), "paragraphs": paragraphs(page["extract"]),
                   "sourceUrl": f"https://de.wikipedia.org/w/index.php?oldid={revision}",
                   "revisionId": revision, "category": category}
        articles.append(article)
        source_titles[article["id"]] = page["title"]
        print(f"{page['title']}: revision {revision}, {sum(len(p.split()) for p in article['paragraphs'])} words")
        time.sleep(.15)
    if len({article["id"] for article in articles}) != len(articles):
        raise ValueError("Duplicate article IDs")
    fetched = datetime.now(timezone.utc).date().isoformat()
    header = "// German Wikipedia excerpts, CC BY-SA 4.0.\n// Shortened and formatted for Wikiland; contributors/source history: docs/wikiland-sources.md.\n"
    header += f"// Generated {fetched} by scripts/update-wikiland-data.py; do not hand-edit.\n"
    header += "import type { WikiArticle } from './wikiland-engine';\n\nexport const WIKI_ARTICLES: WikiArticle[] = "
    (ROOT / "src/lib/wikiland-data.ts").write_text(header + json.dumps(articles, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
    rows = []
    for article in articles:
        title = source_titles[article["id"]]
        history = f"https://de.wikipedia.org/w/index.php?title={quote(title.replace(' ', '_'))}&action=history"
        rows.append(f"| {title} | {article['category']} | [{article['revisionId']}]({article['sourceUrl']}) | [Autoren/Versionsgeschichte]({history}) |")
    documentation = f"""# Wikiland: Textquellen und Lizenz

Stand der gebündelten Texte: {fetched}. {len(articles)} ausgewählte Artikel der deutschsprachigen Wikipedia.

## Namensnennung und Lizenz

Die Textauszüge stammen von den jeweiligen **Wikipedia-Autorinnen und -Autoren**. Die nachfolgende Tabelle verlinkt jede verwendete Artikelversion und ihre Versionsgeschichte mit der vollständigen Autorenliste.

Die Auszüge und ihre Bearbeitungen stehen unter **[Creative Commons Namensnennung – Weitergabe unter gleichen Bedingungen 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/deed.de)**. Diese Lizenzangabe bezieht sich auf die Wikipedia-Texte und deren Bearbeitungen, nicht pauschal auf den unabhängig entwickelten Spielcode. Das Projekt ist kein Angebot der Wikipedia oder Wikimedia Foundation.

Änderungen: Auswahl von vier bis acht vollständigen Absätzen pro Artikel; Entfernung von Zitiermarkierungen und Aussprachetranskriptionen; Vereinheitlichung von Leerraum; Auslassung von Überschriften, Formeln und nicht geeignetem Layout. Klammerzusätze zur Begriffsklärung im Artikeltitel werden für die Rätsellösung weggelassen. Im Spiel werden Wörter vorübergehend verdeckt und durch Rateversuche sichtbar. Die Inhalte werden weder neu formuliert noch inhaltlich ergänzt. Zahlen, Schreibweisen und Aussagen entsprechen dem Abrufstand und können veralten.

Hinweise zur Weiternutzung: [Wikipedia:Weiternutzung](https://de.wikipedia.org/wiki/Wikipedia:Weiternutzung). Die stabile Versions-ID in `sourceUrl` erlaubt die Überprüfung des Ausgangstextes.

## Quellenregister

| Artikel | Bereich | Verwendete Version | Mitwirkende |
| --- | --- | --- | --- |
{chr(10).join(rows)}

## Aktualisierung

```sh
python scripts/update-wikiland-data.py
```

Das Skript verwendet ausschließlich die öffentliche, lesende MediaWiki-API (`prop=extracts|revisions`) mit eigenem User-Agent. Es lädt die kuratierte Themenliste, validiert IDs und Mindestlänge und erzeugt `src/lib/wikiland-data.ts` und dieses Quellenregister. Für das Spielen selbst ist kein Wikipedia-Aufruf erforderlich. Keine Bilder, Logos, Dateien oder Texte von Redactle werden übernommen.

Eine Aktualisierung kann Inhalte und Rätsellösungen verändern; bestehende Spielstände müssen daher mit den jeweiligen Artikel-IDs und ggf. einer neuen Datenversion abgestimmt werden. Tagesrätsel werden aus dem lokalen, endlichen Artikelpool gewählt.
"""
    (ROOT / "docs/wikiland-sources.md").write_text(documentation, encoding="utf-8")


if __name__ == "__main__":
    main()

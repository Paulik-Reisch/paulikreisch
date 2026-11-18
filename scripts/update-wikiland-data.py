"""Validate Wikiland's pinned revision catalogue without changing active puzzles.

Run: python scripts/update-wikiland-data.py
The catalogue must be deliberately edited and reviewed to change revisions: changing
one can alter an active daily puzzle and invalidate saved hints. Article text is not
bundled; the browser requests the pinned Wikipedia revision when a game starts.
"""
import json
from pathlib import Path

path = Path(__file__).resolve().parents[1] / 'src/lib/wikiland-data.ts'
source = path.read_text(encoding='utf-8')
entries = json.loads(source.split(' = ', 1)[1].rstrip().removesuffix(';'))
ids = set()
revisions = set()
for article in entries:
    assert article['id'] not in ids, f"Duplicate article ID: {article['id']}"
    assert article['revisionId'] not in revisions, f"Duplicate revision: {article['revisionId']}"
    assert isinstance(article['revisionId'], int) and article['revisionId'] > 0
    assert article['paragraphs'] == [], 'Full articles must not be bundled as excerpts'
    assert article['sourceUrl'] == f"https://de.wikipedia.org/w/index.php?oldid={article['revisionId']}"
    ids.add(article['id'])
    revisions.add(article['revisionId'])
print(f'Validated {len(entries)} pinned revision records; no content or revisions changed.')

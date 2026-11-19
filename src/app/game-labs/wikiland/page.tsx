'use client';

import { createElement, memo, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CircleHelp, Flag, Lightbulb, RotateCw, Share2 } from 'lucide-react';
import { WikipediaIcon } from '@/components/ui/icons/wikipedia-icon';
import { Logo } from '@/components/ui/logo';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { applyHint, countLetters, createGame, getArticle, getGuessHits, getGuessMatchKeys, hasValidHints, isRevealed, isWon, normalizeWord, submitGuess, tokenize, upgradeLegacyGame, type WikiGame, type WikiToken } from '@/lib/wikiland-engine';
import { loadWikiGame, parseWikiGame, saveWikiGame } from '@/lib/wikiland-storage';
import { fetchWikipediaRevision, prepareWikipediaArticle, type ArticleNode, type FullWikiArticle } from '@/lib/wikiland-wikipedia';
import styles from './wikiland.module.css';

const SECTION_BATCH = 30;

function today() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function clock(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

function renderTokens(tokens: WikiToken[], game: WikiGame, article: FullWikiArticle['article'], highlight: Set<string>, inTitle = false) {
  return tokens.map((token, index) => {
    if (!token.word || isRevealed(token, game, inTitle, article)) {
      const highlighted = token.word && highlight.has(token.key);
      return <span key={index} data-wiki-hit={highlighted || undefined} className={highlighted ? styles.highlight : undefined}>{token.text}</span>;
    }
    const length = countLetters(token.text);
    return <span key={index} className={styles.redacted} style={{ width: `${length}ch` }} role="img" aria-label={`Verborgenes Wort, ${length} Buchstaben`}><span aria-hidden="true">{length}</span></span>;
  });
}

function renderNode(node: ArticleNode, index: number, game: WikiGame, article: FullWikiArticle['article'], highlight: Set<string>): React.ReactNode {
  if (node.type === 'text') return <span key={index}>{renderTokens(node.tokens, game, article, highlight)}</span>;
  if (node.tag === 'br' || node.tag === 'hr') return createElement(node.tag, { key: index });
  return createElement(node.tag, { key: index }, node.children.map((child, childIndex) => renderNode(child, childIndex, game, article, highlight)));
}

function matchingSections(full: FullWikiArticle, title: WikiToken[], word: string) {
  const keys = getGuessMatchKeys(full.article, word);
  const sections: number[] = [];
  function addMatches(tokens: WikiToken[], section: number) {
    for (const token of tokens) {
      if (token.word && keys.has(token.key)) sections.push(section);
    }
  }
  function visit(node: ArticleNode, section: number) {
    if (node.type === 'text') addMatches(node.tokens, section);
    else node.children.forEach(child => visit(child, section));
  }
  addMatches(title, -1);
  full.nodes.forEach(visit);
  return sections;
}

// Timer updates must not rebuild the potentially enormous article DOM every second.
const ArticleBody = memo(function ArticleBody({ full, game, highlight, limit, onMore }: { full: FullWikiArticle; game: WikiGame; highlight: string; limit: number; onMore: () => void }) {
  const article = full.article;
  const keys = highlight ? getGuessMatchKeys(article, highlight) : new Set<string>();
  return <><h2 className={styles.articleTitle}>{renderTokens(tokenize(article.title), game, article, keys, true)}</h2><div className={styles.wikiContent}>{full.nodes.slice(0, limit).map((node, index) => renderNode(node, index, game, article, keys))}</div>{limit < full.nodes.length && <button className={styles.secondary} type="button" onClick={onMore}>Weitere Abschnitte anzeigen</button>}{(isWon(game, article) || game.givenUp) && <a href={article.sourceUrl} target="_blank" rel="noreferrer" className={styles.original}>Wikipedia-Artikel öffnen <ArrowUpRight size={16} aria-hidden="true" /></a>}</>;
}, (a, b) => a.full === b.full && a.game.guesses === b.game.guesses && a.game.hints === b.game.hints && a.game.givenUp === b.game.givenUp && a.highlight === b.highlight && a.limit === b.limit);

export default function WikilandPage() {
  const [game, setGame] = useState<WikiGame | null>(null);
  const [input, setInput] = useState('');
  const [loaded, setLoaded] = useState<{ id: string; full: FullWikiArticle } | null>(null);
  const [loadError, setLoadError] = useState<'network' | 'invalid' | null>(null);
  const [retry, setRetry] = useState(0);
  const [limit, setLimit] = useState(SECTION_BATCH);
  const [message, setMessage] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
  const [canSave, setCanSave] = useState(true);
  const [visible, setVisible] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [pending, setPending] = useState<'daily' | 'free' | 'giveup' | null>(null);
  const [sort, setSort] = useState<'recent' | 'hits'>('recent');
  const [highlight, setHighlight] = useState('');
  const [jump, setJump] = useState<{ word: string; occurrence: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const sourceButton = useRef<HTMLButtonElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const full = game && loaded?.id === game.puzzleId ? loaded.full : null;
  const article = full?.article;
  const ready = !!article;
  const won = game && article ? isWon(game, article) : false;
  const finished = won || !!game?.givenUp;
  const gameId = game ? `${game.mode}:${game.date}:${game.puzzleId}` : '';
  const titleTokens = useMemo(() => article ? tokenize(article.title) : [], [article]);
  const paragraphs = useMemo(() => article?.paragraphs.map(tokenize) ?? [], [article]);
  const guessedWords = game?.guesses;
  const guesses = useMemo(() => {
    if (!article || !guessedWords) return [];
    const entries = guessedWords.map((word, index) => ({ word, number: index + 1, hits: getGuessHits(article, word) })).reverse();
    return sort === 'hits' ? entries.sort((a, b) => b.hits - a.hits || b.number - a.number) : entries;
  }, [article, guessedWords, sort]);

  useEffect(() => {
    const controller = new AbortController();
    async function restore() {
      let saved = loadWikiGame();
      if (!saved && location.pathname === '/wikiland') {
        // The old cookie is only sent to URLs under /game-labs/wikiland.
        try {
          const response = await fetch('/game-labs/wikiland/saved-game', { signal: controller.signal });
          if (response.status !== 204) {
            saved = response.ok ? parseWikiGame(await response.text()) : null;
            if (!saved) throw new Error('Save lookup failed');
          }
        } catch {
          if (controller.signal.aborted) return;
          // Keep the old save intact if we could not check it.
          setCanSave(false);
          setStorageFailed(true);
        }
      }
      if (controller.signal.aborted) return;
      const date = today();
      setGame(saved && (saved.mode === 'free' || saved.date === date) ? saved : createGame('daily', date));
    }
    void restore();
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      controller.abort();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  useEffect(() => {
    if (!game?.puzzleId) return;
    const base = getArticle(game.puzzleId);
    if (!base) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    let active = true;
    setLoaded(null);
    setLoadError(null);
    setLimit(SECTION_BATCH);
    fetchWikipediaRevision(base.revisionId, controller.signal).then(({ title, html }) => {
      const full = prepareWikipediaArticle(base, title, html, document);
      if (!hasValidHints(game, full.article, base)) throw new Error('invalid-save');
      if (active) {
        if (!game.revisionAware) setGame(upgradeLegacyGame(game));
        setLoaded({ id: base.id, full });
      }
    }).catch((error: unknown) => { if (active) setLoadError(error instanceof Error && error.message === 'invalid-save' ? 'invalid' : 'network'); }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [game?.puzzleId, retry]);

  useEffect(() => {
    if (!gameId || !ready || finished || !visible || rulesOpen || sourceOpen || pending) return;
    const timer = window.setInterval(() => setGame(current => current ? { ...current, elapsed: current.elapsed + 1 } : current), 1000);
    return () => window.clearInterval(timer);
  }, [gameId, ready, finished, visible, rulesOpen, sourceOpen, pending]);

  useEffect(() => {
    if (game && ready && canSave) setStorageFailed(!saveWikiGame(game));
  }, [game, ready, canSave]);

  useEffect(() => {
    if (!jump) return;
    // The matching section may have been mounted by the same click.
    articleRef.current?.querySelectorAll('[data-wiki-hit]')[jump.occurrence]?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, [jump]);

  function jumpToGuess(word: string, hits: number) {
    setHighlight(word);
    if (!full || !hits) {
      setJump(null);
      return;
    }
    const sections = matchingSections(full, titleTokens, word);
    if (!sections.length) return;
    const occurrence = jump?.word === word ? (jump.occurrence + 1) % sections.length : 0;
    const requiredLimit = Math.ceil((sections[occurrence] + 1) / SECTION_BATCH) * SECTION_BATCH;
    setLimit(value => Math.max(value, requiredLimit));
    setJump({ word, occurrence });
  }

  function start(mode: 'daily' | 'free') {
    setGame(createGame(mode, today(), game?.puzzleId));
    setInput('');
    setMessage('');
    setHighlight('');
    setJump(null);
    inputRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function requestGame(mode: 'daily' | 'free') {
    if (!game) return;
    if (mode === 'daily' && game.mode === 'daily' && game.date === today()) return;
    if (!finished && (game.guesses.length || game.hints.length)) setPending(mode);
    else start(mode);
  }

  function guess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!game || !article || finished) return;
    const result = submitGuess(game, input, article);
    if (result.outcome === 'invalid') {
      setMessage('Gib ein einzelnes Wort oder den vollständigen Titel ein.');
      inputRef.current?.select();
      return;
    }
    if (result.outcome === 'duplicate') {
      setMessage('Dieses Wort ist bereits aufgedeckt oder wurde schon versucht. Es zählt nicht erneut.');
      inputRef.current?.select();
      return;
    }
    if (result.outcome === 'finished') return;
    setGame(result.game);
    setHighlight(normalizeWord(input));
    setJump(null);
    setInput('');
    setMessage(isWon(result.game, article) ? 'Titel gefunden! Der Artikel ist aufgedeckt.' : result.hits ? `${result.hits} Treffer. Die passenden Wörter sind aufgedeckt.` : 'Kein Treffer. Versuch ein anderes Wort.');
    inputRef.current?.focus();
  }

  function hint() {
    if (!game || !article || finished) return;
    const next = applyHint(game, article);
    setGame(next);
    const key = next.hints.length > game.hints.length ? next.hints[next.hints.length - 1] : '';
    const revealed = [...titleTokens, ...paragraphs.flat()].find(token => token.key === key)?.text;
    setHighlight(key);
    setJump(null);
    setMessage(isWon(next, article) ? 'Titel gefunden! Der Artikel ist aufgedeckt.' : revealed ? `Hinweis: „${revealed}“ wurde im Artikel aufgedeckt.` : 'Es gibt kein weiteres verborgenes Wort.');
  }

  async function share() {
    if (!game) return;
    const text = `Wikiland · ${game.mode === 'daily' ? game.date : 'Freie Runde'}\n${won ? 'Titel gefunden' : 'Artikel aufgedeckt'} · ${game.guesses.length} Versuche · ${game.hints.length} Hinweise · ${clock(game.elapsed)}\nhttps://paulikreisch.de/wikiland`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Dein Ergebnis ist kopiert – ohne die Lösung zu verraten.');
    } catch {
      setMessage('Kopieren ist in diesem Browser nicht möglich.');
    }
  }


  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.brand} aria-label="Paulik und Reisch Startseite"><Logo className="h-8 w-auto" /><span>Paulik &amp; Reisch</span></Link>
          <div className={styles.heading}><WikipediaIcon /><h1>Wikiland</h1></div>
          <div className={styles.headerActions}><Link href="/game-labs" className={styles.iconButton} aria-label="Zu Game Labs"><ArrowLeft size={19} aria-hidden="true" /></Link><button ref={helpButton} className={styles.help} type="button" onClick={() => setRulesOpen(true)} aria-label="Spielregeln öffnen"><CircleHelp size={21} aria-hidden="true" /><span>Spielregeln</span></button></div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.gameBar}>
          <div className={styles.modes} role="group" aria-label="Spielmodus"><button type="button" aria-pressed={game?.mode === 'daily'} disabled={!game || !ready} onClick={() => requestGame('daily')}>Tagesrätsel</button><button type="button" aria-pressed={game?.mode === 'free'} disabled={!game || !ready} onClick={() => requestGame('free')}>Freie Runde</button></div>
          <span className={styles.date}>{game?.mode === 'daily' ? game.date.split('-').reverse().join('.') : 'Freies Spiel'}</span>
        </div>

        <div className={styles.layout}>
          <section className={styles.controls} aria-label="Wörter raten">
            <div className={styles.stats}><div><strong>{game?.guesses.length ?? 0}</strong><span>Versuche</span></div><div><strong>{game?.hints.length ?? 0}</strong><span>Hinweise</span></div><div><strong>{game ? clock(game.elapsed) : '00:00'}</strong><span>Spielzeit</span></div></div>
            {finished ? <div className={styles.result}>
              <h2>{won ? 'Titel gefunden!' : 'Artikel aufgedeckt'}</h2><p>{won ? 'Du hast das Rätsel gelöst.' : 'Beim nächsten Artikel geht’s weiter.'}</p>
              <button className={styles.primary} type="button" onClick={share}><Share2 size={17} aria-hidden="true" /> Ergebnis kopieren</button>
              <button className={styles.secondary} type="button" onClick={() => start('free')}><RotateCw size={17} aria-hidden="true" /> Nächste freie Runde</button>
            </div> : <>
              <form onSubmit={guess} className={styles.form}>
                <label htmlFor="wiki-guess">Dein Wort</label>
                <div className={styles.inputRow}><input ref={inputRef} id="wiki-guess" type="text" maxLength={100} value={input} onChange={event => setInput(event.target.value)} placeholder="Wort oder vollständiger Titel" autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={!game || !ready} /><button type="submit" disabled={!game || !ready || !input.trim()}>Raten</button></div>
              </form>
              <div className={styles.tools}><button type="button" onClick={hint} disabled={!game || !ready}><Lightbulb size={17} aria-hidden="true" /> Hinweis</button><button type="button" onClick={() => setPending('giveup')} disabled={!game || !ready}><Flag size={16} aria-hidden="true" /> Aufdecken</button><button type="button" onClick={() => requestGame('free')} disabled={!game || !ready} aria-label="Neuen Artikel starten"><RotateCw size={17} aria-hidden="true" /></button></div>
            </>}
            <div className={styles.message} role="status" aria-live="polite" aria-atomic="true">{message}</div>
            {storageFailed && <p className={styles.storageNotice} role="status">Dein Fortschritt lässt sich gerade nicht speichern. Du kannst weiterspielen; nach dem Schließen fehlen die letzten Züge.</p>}
            <details className={styles.history}>
              <summary>Wortverlauf <span>{guesses.length}</span></summary>
              <div className={styles.historyBody}>
                <label className={styles.sort}>Sortieren<select value={sort} onChange={event => setSort(event.target.value as 'recent' | 'hits')}><option value="recent">Neueste zuerst</option><option value="hits">Meiste Treffer</option></select></label>
                {guesses.length ? <ol className={styles.guessList}>{guesses.map(entry => <li key={entry.number}><span className={styles.guessNumber}>{entry.number}</span><button type="button" className={entry.hits ? styles.hitWord : styles.missWord} onClick={() => jumpToGuess(entry.word, entry.hits)}>{entry.word}</button><span className={`${styles.hitCount} ${entry.hits ? styles.hasHits : ''}`} aria-label={`${entry.hits} Treffer`}>{entry.hits}</span></li>)}</ol> : <p className={styles.emptyHistory}>Noch keine Versuche.</p>}
              </div>
            </details>
          </section>

          <article ref={articleRef} className={styles.article} aria-label="Verborgener Wikipedia-Artikel">
            {full && game ? <ArticleBody full={full} game={game} highlight={highlight} limit={limit} onMore={() => setLimit(value => value + SECTION_BATCH)} /> : loadError ? <div role="alert">{loadError === 'invalid' ? <><p>Der gespeicherte Hinweis passt nicht zur Artikelversion. Der Spielstand wurde nicht überschrieben.</p><button type="button" className={styles.secondary} onClick={() => start('free')}>Neue freie Runde starten</button></> : <><p>Der Wikipedia-Artikel konnte nicht geladen werden. Dein Spielstand bleibt erhalten.</p><button type="button" className={styles.secondary} onClick={() => setRetry(value => value + 1)}>Erneut versuchen</button></>}</div> : <p className={styles.loading}>Der Wikipedia-Artikel wird geladen …</p>}
          </article>
        </div>

        <footer className={styles.footer}><button ref={sourceButton} type="button" onClick={() => setSourceOpen(true)}>Quelle &amp; Lizenz</button><Link href="/cookie-richtlinie">Cookies</Link><Link href="/impressum">Impressum</Link></footer>
      </main>

      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}><DialogContent className={styles.dialog} onCloseAutoFocus={event => { event.preventDefault(); helpButton.current?.focus(); }}><DialogHeader><DialogTitle className={styles.dialogTitle}>So spielst du Wikiland</DialogTitle><DialogDescription>Finde den Titel des verborgenen Wikipedia-Artikels.</DialogDescription></DialogHeader><ol className={styles.rules}><li><strong>Wörter aufdecken.</strong><p>Gib ein Wort ein. Alle passenden Stellen im Artikel werden sichtbar, und du siehst die Anzahl der Treffer. Häufige Wörter, Zahlen und Satzzeichen sind schon offen.</p></li><li><strong>Den Titel finden.</strong><p>Decke alle verborgenen Wörter im Titel auf oder rate den vollständigen Titel auf einmal. Dann ist das Rätsel gelöst.</p></li><li><strong>Schreibweise zählt.</strong><p>Groß- und Kleinschreibung spielen keine Rolle. Ä/ae, ö/oe, ü/ue und ß/ss zählen gleich. Andere Wortformen musst du einzeln versuchen. Doppelte Versuche zählen nicht erneut.</p></li></ol><p className={styles.ruleNote}>Ein Hinweis deckt ein Wort auf und wird mitgezählt. „Aufdecken“ beendet die Runde und zeigt die Lösung. Das Tagesrätsel wechselt um Mitternacht deutscher Zeit.</p></DialogContent></Dialog>

      <Dialog open={sourceOpen} onOpenChange={setSourceOpen}><DialogContent className={styles.dialog} onCloseAutoFocus={event => { event.preventDefault(); sourceButton.current?.focus(); }}><DialogHeader><DialogTitle className={styles.dialogTitle}>Quelle &amp; Lizenz</DialogTitle><DialogDescription>Text: Wikipedia-Mitwirkende. Die feste Artikelversion wird für das Rätsel geschwärzt und vereinfacht dargestellt.</DialogDescription></DialogHeader><div className={styles.sourceLinks}><a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de" target="_blank" rel="noreferrer">Creative Commons BY-SA 4.0</a>{article && <><a href={article.sourceUrl} target="_blank" rel="noreferrer">Wikipedia-Original öffnen (verrät die Lösung)</a><a href={`https://de.wikipedia.org/w/index.php?oldid=${article.revisionId}&action=history`} target="_blank" rel="noreferrer">Bearbeitungsgeschichte und Mitwirkende</a></>}<p>Wikipedia-Logo: Wikimedia / Nohat, Konzept Paullusmagnus. Unveränderte Grafik mit animiertem Lichtreflex.</p><a href="https://commons.wikimedia.org/wiki/File:Wikipedia-logo-v2.svg" target="_blank" rel="noreferrer">Logo-Quelle · CC BY-SA 3.0</a><p>Wikiland ist ein unabhängiges Spiel von Paulik &amp; Reisch, kein Angebot der Wikimedia Foundation.</p></div></DialogContent></Dialog>

      <AlertDialog open={pending !== null} onOpenChange={open => { if (!open) setPending(null); }}><AlertDialogContent className={styles.dialog}><AlertDialogHeader><AlertDialogTitle>{pending === 'giveup' ? 'Den Artikel aufdecken?' : 'Den Artikel wechseln?'}</AlertDialogTitle><AlertDialogDescription>{pending === 'giveup' ? 'Die Runde wird beendet und der vollständige Artikel sichtbar. Sie zählt als aufgedeckt, nicht als gelöst.' : 'Dein aktueller Spielstand wird durch die neue Runde ersetzt. Dieser Schritt lässt sich nicht rückgängig machen.'}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Weiterraten</AlertDialogCancel><AlertDialogAction onClick={() => { if (!game || !pending) return; if (pending === 'giveup') { setGame({ ...game, givenUp: true }); setMessage('Der Artikel ist aufgedeckt.'); } else start(pending); setPending(null); }}>{pending === 'giveup' ? 'Artikel aufdecken' : 'Neue Runde starten'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

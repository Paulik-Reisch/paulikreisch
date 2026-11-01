'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CircleHelp, Flag, Lightbulb, RotateCw, Share2 } from 'lucide-react';
import { WikipediaIcon } from '@/components/ui/icons/wikipedia-icon';
import { Logo } from '@/components/ui/logo';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { applyHint, createGame, getArticle, getGuessHits, isRevealed, isWon, normalizeWord, submitGuess, tokenize, type WikiGame, type WikiToken } from '@/lib/wikiland-engine';
import { loadWikiGame, saveWikiGame } from '@/lib/wikiland-storage';
import styles from './wikiland.module.css';

function today() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function clock(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function WikilandPage() {
  const [game, setGame] = useState<WikiGame | null>(null);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [storageFailed, setStorageFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [pending, setPending] = useState<'daily' | 'free' | 'giveup' | null>(null);
  const [sort, setSort] = useState<'recent' | 'hits'>('recent');
  const [highlight, setHighlight] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const helpButton = useRef<HTMLButtonElement>(null);
  const sourceButton = useRef<HTMLButtonElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const article = game ? getArticle(game.puzzleId) : undefined;
  const won = game ? isWon(game) : false;
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
    const saved = loadWikiGame();
    const date = today();
    setGame(saved && (saved.mode === 'free' || saved.date === date) ? saved : createGame('daily', date));
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!gameId || finished || !visible || rulesOpen || sourceOpen || pending) return;
    const timer = window.setInterval(() => setGame(current => current ? { ...current, elapsed: current.elapsed + 1 } : current), 1000);
    return () => window.clearInterval(timer);
  }, [gameId, finished, visible, rulesOpen, sourceOpen, pending]);

  useEffect(() => {
    if (game) setStorageFailed(!saveWikiGame(game));
  }, [game]);

  function start(mode: 'daily' | 'free') {
    setGame(createGame(mode, today(), game?.puzzleId));
    setInput('');
    setMessage('');
    setHighlight('');
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
    if (!game || finished) return;
    const result = submitGuess(game, input);
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
    setInput('');
    setMessage(isWon(result.game) ? 'Titel gefunden! Der Artikel ist aufgedeckt.' : result.hits ? `${result.hits} Treffer. Die passenden Wörter sind aufgedeckt.` : 'Kein Treffer. Versuch ein anderes Wort.');
    inputRef.current?.focus();
  }

  function hint() {
    if (!game || finished) return;
    const next = applyHint(game);
    setGame(next);
    const key = next.hints.length > game.hints.length ? next.hints[next.hints.length - 1] : '';
    const revealed = [...titleTokens, ...paragraphs.flat()].find(token => token.key === key)?.text;
    setHighlight(key);
    setMessage(isWon(next) ? 'Titel gefunden! Der Artikel ist aufgedeckt.' : revealed ? `Hinweis: „${revealed}“ wurde im Artikel aufgedeckt.` : 'Es gibt kein weiteres verborgenes Wort.');
  }

  async function share() {
    if (!game) return;
    const text = `Wikiland · ${game.mode === 'daily' ? game.date : 'Freie Runde'}\n${won ? 'Titel gefunden' : 'Artikel aufgedeckt'} · ${game.guesses.length} Versuche · ${game.hints.length} Hinweise · ${clock(game.elapsed)}\nhttps://paulikreisch.de/game-labs/wikiland`;
    try {
      await navigator.clipboard.writeText(text);
      setMessage('Dein Ergebnis ist kopiert – ohne die Lösung zu verraten.');
    } catch {
      setMessage('Kopieren ist in diesem Browser nicht möglich.');
    }
  }

  function renderTokens(tokens: WikiToken[], inTitle = false) {
    if (!game) return null;
    return tokens.map((token, index) => {
      if (!token.word || finished || isRevealed(token, game, inTitle)) {
        const highlighted = token.word && highlight && token.key === highlight;
        return <span key={index} className={highlighted ? styles.highlight : undefined}>{token.text}</span>;
      }
      return <span key={index} className={styles.redacted} style={{ width: `${[...token.text].length}ch` }} role="img" aria-label={`Verborgenes Wort, ${[...token.text].length} Buchstaben`} />;
    });
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
          <div className={styles.modes} role="group" aria-label="Spielmodus"><button type="button" aria-pressed={game?.mode === 'daily'} disabled={!game} onClick={() => requestGame('daily')}>Tagesrätsel</button><button type="button" aria-pressed={game?.mode === 'free'} disabled={!game} onClick={() => requestGame('free')}>Freie Runde</button></div>
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
                <div className={styles.inputRow}><input ref={inputRef} id="wiki-guess" type="text" maxLength={100} value={input} onChange={event => setInput(event.target.value)} placeholder="Wort oder vollständiger Titel" autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={!game} /><button type="submit" disabled={!game || !input.trim()}>Raten</button></div>
              </form>
              <div className={styles.tools}><button type="button" onClick={hint} disabled={!game}><Lightbulb size={17} aria-hidden="true" /> Hinweis</button><button type="button" onClick={() => setPending('giveup')} disabled={!game}><Flag size={16} aria-hidden="true" /> Aufdecken</button><button type="button" onClick={() => requestGame('free')} disabled={!game} aria-label="Neuen Artikel starten"><RotateCw size={17} aria-hidden="true" /></button></div>
            </>}
            <div className={styles.message} role="status" aria-live="polite" aria-atomic="true">{message}</div>
            {storageFailed && <p className={styles.storageNotice} role="status">Dein Fortschritt lässt sich gerade nicht speichern. Du kannst weiterspielen; nach dem Schließen fehlen die letzten Züge.</p>}
            <details className={styles.history}>
              <summary>Wortverlauf <span>{guesses.length}</span></summary>
              <div className={styles.historyBody}>
                <label className={styles.sort}>Sortieren<select value={sort} onChange={event => setSort(event.target.value as 'recent' | 'hits')}><option value="recent">Neueste zuerst</option><option value="hits">Meiste Treffer</option></select></label>
                {guesses.length ? <ol className={styles.guessList}>{guesses.map(entry => <li key={entry.number}><span className={styles.guessNumber}>{entry.number}</span><button type="button" className={entry.hits ? styles.hitWord : styles.missWord} onClick={() => { setHighlight(normalizeWord(entry.word)); articleRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }); }}>{entry.word}</button><span className={`${styles.hitCount} ${entry.hits ? styles.hasHits : ''}`} aria-label={`${entry.hits} Treffer`}>{entry.hits}</span></li>)}</ol> : <p className={styles.emptyHistory}>Noch keine Versuche.</p>}
              </div>
            </details>
          </section>

          <article ref={articleRef} className={styles.article} aria-label="Verborgener Wikipedia-Artikel">
            {article ? <><h2 className={styles.articleTitle}>{renderTokens(titleTokens, true)}</h2>{paragraphs.map((tokens, index) => <p key={index}>{renderTokens(tokens)}</p>)}{finished && <a href={article.sourceUrl} target="_blank" rel="noreferrer" className={styles.original}>Wikipedia-Artikel öffnen <ArrowUpRight size={16} aria-hidden="true" /></a>}</> : <p className={styles.loading}>Der Artikel wird vorbereitet …</p>}
          </article>
        </div>

        <footer className={styles.footer}><button ref={sourceButton} type="button" onClick={() => setSourceOpen(true)}>Quelle &amp; Lizenz</button><Link href="/cookie-richtlinie">Cookies</Link><Link href="/impressum">Impressum</Link></footer>
      </main>

      <Dialog open={rulesOpen} onOpenChange={setRulesOpen}><DialogContent className={styles.dialog} onCloseAutoFocus={event => { event.preventDefault(); helpButton.current?.focus(); }}><DialogHeader><DialogTitle className={styles.dialogTitle}>So spielst du Wikiland</DialogTitle><DialogDescription>Finde den Titel des verborgenen Wikipedia-Artikels.</DialogDescription></DialogHeader><ol className={styles.rules}><li><strong>Wörter aufdecken.</strong><p>Gib ein Wort ein. Alle passenden Stellen im Artikel werden sichtbar, und du siehst die Anzahl der Treffer. Häufige Wörter, Zahlen und Satzzeichen sind schon offen.</p></li><li><strong>Den Titel finden.</strong><p>Decke alle verborgenen Wörter im Titel auf oder rate den vollständigen Titel auf einmal. Dann ist das Rätsel gelöst.</p></li><li><strong>Schreibweise zählt.</strong><p>Groß- und Kleinschreibung spielen keine Rolle. Ä/ae, ö/oe, ü/ue und ß/ss zählen gleich. Andere Wortformen musst du einzeln versuchen. Doppelte Versuche zählen nicht erneut.</p></li></ol><p className={styles.ruleNote}>Ein Hinweis deckt ein Wort auf und wird mitgezählt. „Aufdecken“ beendet die Runde und zeigt die Lösung. Das Tagesrätsel wechselt um Mitternacht deutscher Zeit.</p></DialogContent></Dialog>

      <Dialog open={sourceOpen} onOpenChange={setSourceOpen}><DialogContent className={styles.dialog} onCloseAutoFocus={event => { event.preventDefault(); sourceButton.current?.focus(); }}><DialogHeader><DialogTitle className={styles.dialogTitle}>Quelle &amp; Lizenz</DialogTitle><DialogDescription>Text: Wikipedia-Mitwirkende. Der Auszug wurde gekürzt und für das Rätsel geschwärzt.</DialogDescription></DialogHeader><div className={styles.sourceLinks}><a href="https://creativecommons.org/licenses/by-sa/4.0/deed.de" target="_blank" rel="noreferrer">Creative Commons BY-SA 4.0</a>{article && <><a href={article.sourceUrl} target="_blank" rel="noreferrer">Wikipedia-Original öffnen (verrät die Lösung)</a><a href={`https://de.wikipedia.org/w/index.php?oldid=${article.revisionId}&action=history`} target="_blank" rel="noreferrer">Bearbeitungsgeschichte und Mitwirkende</a></>}<p>Wikipedia-Logo: Wikimedia / Nohat, Konzept Paullusmagnus. Unveränderte Grafik mit animiertem Lichtreflex.</p><a href="https://commons.wikimedia.org/wiki/File:Wikipedia-logo-v2.svg" target="_blank" rel="noreferrer">Logo-Quelle · CC BY-SA 3.0</a><p>Wikiland ist ein unabhängiges Spiel von Paulik &amp; Reisch, kein Angebot der Wikimedia Foundation.</p></div></DialogContent></Dialog>

      <AlertDialog open={pending !== null} onOpenChange={open => { if (!open) setPending(null); }}><AlertDialogContent className={styles.dialog}><AlertDialogHeader><AlertDialogTitle>{pending === 'giveup' ? 'Den Artikel aufdecken?' : 'Den Artikel wechseln?'}</AlertDialogTitle><AlertDialogDescription>{pending === 'giveup' ? 'Die Runde wird beendet und der vollständige Artikel sichtbar. Sie zählt als aufgedeckt, nicht als gelöst.' : 'Dein aktueller Spielstand wird durch die neue Runde ersetzt. Dieser Schritt lässt sich nicht rückgängig machen.'}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Weiterraten</AlertDialogCancel><AlertDialogAction onClick={() => { if (!game || !pending) return; if (pending === 'giveup') { setGame({ ...game, givenUp: true }); setMessage('Der Artikel ist aufgedeckt.'); } else start(pending); setPending(null); }}>{pending === 'giveup' ? 'Artikel aufdecken' : 'Neue Runde starten'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}

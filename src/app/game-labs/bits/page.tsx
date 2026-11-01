'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, Lightbulb, LockKeyhole, RotateCcw, Undo2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { generatePuzzle, getConflicts, getHint, isSolved, type Cell, type Size } from '@/lib/bits-engine';
import { clearBitsState, loadBitsState, saveBitsState, type SavedBits } from '@/lib/bits-storage';
import styles from './bits.module.css';
import '../../../../tokens.css';

function freshGame(size: Size): SavedBits {
  const seed = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  const puzzle = generatePuzzle(size, seed);
  return { version: 1, puzzle, board: [...puzzle.givens], elapsed: 0, hints: 0, history: [], completed: false };
}

function clock(seconds: number) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export default function BitsPage() {
  const [game, setGame] = useState<SavedBits | null>(null);
  const [message, setMessage] = useState('Ein kleiner Moment. Dein Rätsel wird vorbereitet.');
  const [storageFailed, setStorageFailed] = useState(false);
  const [remember, setRemember] = useState(true);
  const [visible, setVisible] = useState(true);
  const [conflicts, setConflicts] = useState<number[]>([]);
  const [hintCell, setHintCell] = useState<number | null>(null);
  const [focused, setFocused] = useState(0);
  const [pending, setPending] = useState<{ kind: 'new' | 'reset' | 'delete'; size: Size } | null>(null);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);
  const puzzleId = game?.puzzle.id;
  const completed = game?.completed;

  useEffect(() => {
    const saved = loadBitsState();
    setGame(saved ?? freshGame(6));
    setMessage(saved ? 'Willkommen zurück. Dein Spielstand ist wieder da.' : 'Ein Feld antippen: leer → 0 → 1 → leer.');
    const onVisibility = () => setVisible(!document.hidden);
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!puzzleId || completed || !visible || pending) return;
    const timer = window.setInterval(() => setGame(current => current && !current.completed ? { ...current, elapsed: current.elapsed + 1 } : current), 1000);
    return () => window.clearInterval(timer);
  }, [puzzleId, completed, visible, pending]);

  useEffect(() => {
    if (game && remember) setStorageFailed(!saveBitsState(game));
  }, [game, remember]);

  function start(size: Size) {
    setGame(freshGame(size));
    setConflicts([]);
    setHintCell(null);
    setFocused(0);
    setMessage('Frisches Rätsel, klarer Kopf. Los geht’s.');
  }

  function requestNew(size: Size) {
    if (!game) return;
    const hasMoves = game.board.some((cell, index) => cell !== game.puzzle.givens[index]);
    if (hasMoves && !game.completed) setPending({ kind: 'new', size });
    else start(size);
  }

  function updateCell(index: number, value: Cell, explanation?: string) {
    if (!game || game.completed || game.puzzle.givens[index] !== -1 || game.board[index] === value) return;
    const board = [...game.board];
    board[index] = value;
    const completed = isSolved(board, game.puzzle.size);
    setGame({ ...game, board, completed, history: [...game.history, game.board].slice(-20), hints: game.hints + (explanation ? 1 : 0) });
    setConflicts([]);
    setHintCell(explanation ? index : null);
    setMessage(completed ? 'Geschafft! Alle Bits sitzen. Lust auf die nächste Runde?' : explanation ?? '');
  }

  function undo() {
    if (!game || !game.history.length || game.completed) return;
    setGame({ ...game, board: game.history[game.history.length - 1], history: game.history.slice(0, -1) });
    setConflicts([]);
    setHintCell(null);
    setMessage('Letzter Zug zurückgenommen.');
  }

  function hint() {
    if (!game || game.completed) return;
    const next = getHint(game.board, game.puzzle);
    if (next) {
      updateCell(next.index, next.value, next.reason);
      setFocused(next.index);
      cells.current[next.index]?.focus();
    } else setMessage('Im Moment gibt es keinen weiteren Hinweis. Prüfe deine Einträge.');
  }

  function check() {
    if (!game) return;
    const found = getConflicts(game.board, game.puzzle.size);
    setConflicts(found);
    setHintCell(null);
    setMessage(found.length ? 'Hier widersprechen sich Einträge. Die markierten Felder verletzen eine Regel.' : 'Bisher kein Regelverstoß. Das ist noch keine Garantie für die Lösung.');
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!game) return;
    const size = game.puzzle.size;
    const row = Math.floor(index / size);
    const column = index % size;
    const target = event.key === 'ArrowRight' ? row * size + (column + 1) % size
      : event.key === 'ArrowLeft' ? row * size + (column + size - 1) % size
        : event.key === 'ArrowDown' ? ((row + 1) % size) * size + column
          : event.key === 'ArrowUp' ? ((row + size - 1) % size) * size + column : null;
    if (target !== null) {
      event.preventDefault();
      setFocused(target);
      cells.current[target]?.focus();
    } else if (['0', '1', 'Backspace', 'Delete'].includes(event.key)) {
      event.preventDefault();
      updateCell(index, event.key === '0' ? 0 : event.key === '1' ? 1 : -1);
    }
  }

  const filled = game?.board.filter(cell => cell !== -1).length ?? 0;
  const total = game?.board.length ?? 36;

  return (
    <div className={`pr-home ${styles.page}`}>
      <header className={styles.nav}>
        <Link href="/game-labs" className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> Game Labs</Link>
        <Link href="/" className={styles.brand} aria-label="Paulik und Reisch Startseite">PAULIK &amp; REISCH <span>SPIELWIESE</span></Link>
      </header>

      <main className={styles.main}>
        <section className={styles.intro} aria-labelledby="bits-title">
          <div>
            <p className={styles.eyebrow}>Zwei Zeichen. Ein klarer Kopf.</p>
            <h1 id="bits-title">Bits<span className={styles.titleMark} aria-hidden="true"><i>0</i><i>1</i></span></h1>
          </div>
          <p className={styles.lead}>Weniger ist manchmal kniffliger.<br />Bring Nullen und Einsen ins Gleichgewicht.</p>
        </section>

        <div className={styles.layout}>
          <section className={styles.play} aria-label="Bits spielen">
            <div className={styles.gameHead}>
              <div className={styles.sizes} role="group" aria-label="Spielfeldgröße">
                {([4, 6, 8] as Size[]).map(size => <button key={size} type="button" aria-pressed={game?.puzzle.size === size} disabled={!game} onClick={() => requestNew(size)}>{size} × {size}</button>)}
              </div>
              <span className={styles.time} aria-label={`Spielzeit ${game ? clock(game.elapsed) : '00:00'}`}>{game ? clock(game.elapsed) : '00:00'}</span>
            </div>

            {game ? <>
              <div className={`${styles.board} ${game.completed ? styles.solved : ''}`} style={{ gridTemplateColumns: `repeat(${game.puzzle.size}, minmax(0, 1fr))` }} role="group" aria-label={`${game.puzzle.size} mal ${game.puzzle.size} Spielfeld`} aria-describedby="bits-controls">
                {game.board.map((cell, index) => {
                  const locked = game.puzzle.givens[index] !== -1;
                  const invalid = conflicts.includes(index);
                  return <button
                    key={`${game.puzzle.id}-${index}`}
                    ref={element => { cells.current[index] = element; }}
                    type="button"
                    tabIndex={focused === index ? 0 : -1}
                    aria-label={`Zeile ${Math.floor(index / game.puzzle.size) + 1}, Spalte ${index % game.puzzle.size + 1}: ${cell === -1 ? 'leer' : cell}${locked ? ', Vorgabe' : ''}${invalid ? ', Regelverstoß' : ''}`}
                    aria-disabled={locked || game.completed}
                    data-invalid={invalid || undefined}
                    onFocus={() => setFocused(index)}
                    onKeyDown={event => onKey(event, index)}
                    onClick={() => updateCell(index, cell === -1 ? 0 : cell === 0 ? 1 : -1)}
                    className={`${styles.cell} ${cell === 0 ? styles.zero : cell === 1 ? styles.one : styles.empty} ${locked ? styles.locked : ''} ${invalid ? styles.invalid : ''} ${hintCell === index ? styles.hinted : ''}`}
                  ><span>{cell === -1 ? '' : cell}</span>{locked && <LockKeyhole className={styles.lock} size={10} aria-hidden="true" />}{invalid && <span className={styles.errorMark} aria-hidden="true">!</span>}</button>;
                })}
              </div>
              <div className={styles.progress}><span>{game.completed ? 'Alles im Gleichgewicht.' : `${filled} von ${total} Feldern gefüllt`}</span><span>{game.hints} {game.hints === 1 ? 'Hinweis' : 'Hinweise'}</span></div>
              <div className={styles.progressTrack} aria-hidden="true"><span style={{ width: `${filled / total * 100}%` }} /></div>
            </> : <div className={styles.loading}>Dein Rätsel entsteht …</div>}

            <div className={styles.tools}>
              <button type="button" onClick={undo} disabled={!game?.history.length || game.completed}><Undo2 size={18} aria-hidden="true" /><span>Zurück</span></button>
              <button type="button" onClick={hint} disabled={!game || game.completed}><Lightbulb size={18} aria-hidden="true" /><span>Hinweis</span></button>
              <button type="button" onClick={check} disabled={!game || game.completed}><Check size={18} aria-hidden="true" /><span>Prüfen</span></button>
              <button type="button" onClick={() => game && setPending({ kind: 'reset', size: game.puzzle.size })} disabled={!game || game.completed || !game.history.length}><RotateCcw size={18} aria-hidden="true" /><span>Reset</span></button>
            </div>
            <div className={`${styles.message} ${game?.completed ? styles.win : ''}`} role="status" aria-live="polite" aria-atomic="true">{game?.completed && <strong>Bit für Bit. Geschafft!</strong>}{message}</div>
            <button type="button" className={styles.newGame} disabled={!game} onClick={() => game && requestNew(game.puzzle.size)}>{game?.completed ? 'Noch eine Runde' : 'Neues Rätsel'}<ArrowUpRight size={18} aria-hidden="true" /></button>
          </section>

          <aside className={styles.aside}>
            <p className={styles.eyebrow}>Die kleine Denksportpause</p>
            <h2>Drei Regeln.<br /><em>Viele Aha-Momente.</em></h2>
            <ol className={styles.rules}>
              <li><span className={styles.ruleNumber}>01</span><div><h3>Halbe, halbe.</h3><p>Jede Zeile und jede Spalte enthält gleich viele Nullen und Einsen.</p><div className={styles.example} aria-hidden="true"><i>0</i><b>1</b><b>1</b><i>0</i></div></div></li>
              <li><span className={styles.ruleNumber}>02</span><div><h3>Aller guten Dinge sind zwei.</h3><p>Drei gleiche Zeichen direkt nebeneinander oder untereinander sind tabu.</p><div className={`${styles.example} ${styles.badExample}`} aria-hidden="true"><i>0</i><i>0</i><i>0</i><span>×</span></div></div></li>
              <li><span className={styles.ruleNumber}>03</span><div><h3>Jede Reihe ein Original.</h3><p>Keine zwei Zeilen und keine zwei Spalten dürfen identisch sein.</p></div></li>
            </ol>
            <div className={styles.instructions} id="bits-controls"><h3>Einfach antippen.</h3><p>Leer → <strong>0</strong> → <strong>1</strong> → leer. Felder mit Schloss sind vorgegeben.</p><p>Mit Tastatur: Pfeiltasten zum Navigieren, <kbd>0</kbd> / <kbd>1</kbd> zum Setzen, <kbd>Entf</kbd> zum Leeren.</p></div>
          </aside>
        </div>

        <footer className={styles.footer}>
          <p>{!remember ? 'Speichern ist für diese Sitzung ausgeschaltet. Dein Spielstand-Cookie wurde gelöscht.' : storageFailed ? 'Speichern ist in diesem Browser nicht möglich. Du kannst spielen; beim Schließen geht der Fortschritt verloren.' : 'Dein Spiel bleibt bei dir. Ein Cookie merkt sich deinen Fortschritt – ohne Account.'}</p>
          <button className={styles.privacyAction} type="button" disabled={!game} onClick={() => {
            if (!remember) { setRemember(true); setMessage('Speichern ist wieder aktiv. Dein Fortschritt bleibt auf diesem Gerät.'); }
            else if (game) setPending({ kind: 'delete', size: game.puzzle.size });
          }}>{remember ? 'Spielstand löschen' : 'Speichern aktivieren'}</button>
          <div><span>Bits · Ein Takuzu-Spiel von P&amp;R</span><Link href="/cookie-richtlinie">Cookies</Link><Link href="/impressum">Impressum</Link></div>
          <p className={styles.credit}>Inspiriert von <a href="https://0hh1.com/" target="_blank" rel="noreferrer">0h h1 von Q42</a>. Eigenständig entwickelt für Game Labs.</p>
        </footer>
      </main>

      <AlertDialog open={pending !== null} onOpenChange={open => { if (!open) setPending(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>{pending?.kind === 'delete' ? 'Gespeicherten Spielstand löschen?' : pending?.kind === 'reset' ? 'Dieses Rätsel zurücksetzen?' : 'Ein neues Rätsel starten?'}</AlertDialogTitle><AlertDialogDescription>{pending?.kind === 'delete' ? 'Das Bits-Cookie wird gelöscht und Speichern für diese Sitzung ausgeschaltet. Du kannst dein laufendes Rätsel weiterspielen.' : pending?.kind === 'reset' ? 'Alle eigenen Einträge, Hinweise und die Spielzeit werden zurückgesetzt. Die Vorgaben bleiben gleich.' : 'Dein aktueller Spielstand wird ersetzt. Dieser Schritt lässt sich nicht rückgängig machen.'}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Weiterspielen</AlertDialogCancel><AlertDialogAction onClick={() => {
            if (!pending || !game) return;
            if (pending.kind === 'delete') {
              clearBitsState(); setRemember(false); setMessage('Gespeicherter Spielstand gelöscht. Du spielst jetzt ohne Speicherung weiter.');
            } else if (pending.kind === 'reset') {
              setGame({ ...game, board: [...game.puzzle.givens], history: [], elapsed: 0, hints: 0, completed: false });
              setConflicts([]); setHintCell(null); setMessage('Alles auf Anfang. Dasselbe Rätsel, ein neuer Blick.');
            } else start(pending.size);
            setPending(null);
          }}>{pending?.kind === 'delete' ? 'Spielstand löschen' : pending?.kind === 'reset' ? 'Zurücksetzen' : 'Neues Rätsel starten'}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

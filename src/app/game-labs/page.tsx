import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import styles from './game-labs.module.css';
import { WorthaftIcon } from '@/components/ui/icons/worthaft-icon';
import { WikipediaIcon } from '@/components/ui/icons/wikipedia-icon';

type Game = {
  id: string;
  title: string;
  description: string;
  status: 'live' | 'alpha';
  href: string;
  icon: string;
};

const games: Game[] = [
  {
    id: 'wikiland',
    title: 'Wikiland',
    description: 'Ein verborgener Wikipedia-Artikel. Deine Wörter bringen ihn ans Licht. Findest du den Titel?',
    status: 'live',
    href: '/game-labs/wikiland',
    icon: 'Wi',
  },
  {
    id: 'bits',
    title: 'Bits',
    description: 'Zwei Zeichen. Drei Regeln. Fülle das Raster mit Nullen und Einsen – ganz ohne Raten.',
    status: 'live',
    href: '/game-labs/bits',
    icon: '01',
  },
  {
    id: 'worthaft',
    title: 'Worthaft',
    description: 'Das tägliche Worträtsel: Errate das Wort in sechs Versuchen.',
    status: 'live',
    href: '/worthaft',
    icon: 'W',
  },
  {
    id: 'hangman',
    title: 'Hangman',
    description: 'Das klassische Galgenmännchen, nur mit deutschen Wörtern.',
    status: 'alpha',
    href: '/game-labs/hangman',
    icon: 'H',
  },
  {
    id: 'worthaft-classic',
    title: 'Worthaft Classic',
    description: 'Die ursprüngliche Version — ohne Joker, Animationen und Einstellungen.',
    status: 'alpha',
    href: '/game-labs/worthaft-classic',
    icon: '01',
  },
];

function GamePreview({ game }: { game: Game }) {
  if (game.id === 'bits') return <div className={styles.bitsPreview}>{[0, 1, -1, 1, 1, -1, 0, 0, -1, 0, 1, -1].map((bit, index) => <span key={index} className={bit === 0 ? styles.zero : bit === 1 ? styles.one : styles.empty}>{bit === -1 ? '' : bit}</span>)}</div>;
  if (game.id === 'wikiland') return <div className={styles.wikiPreview}><WikipediaIcon className={styles.wikiLogo} /><div className={styles.redactions}><i /><i /><i /><i /><i /><i /></div></div>;
  if (game.id === 'worthaft') return <div className={styles.wordPreview}><WorthaftIcon className="h-10 w-10" /><div>{['P', 'A', 'U', 'S', 'E'].map((letter, index) => <span key={letter} className={index < 2 ? styles.zero : index === 2 ? styles.one : styles.absent}>{letter}</span>)}</div></div>;
  return <span className={styles.alphaMark}>{game.icon}</span>;
}

export default function GameLabsPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.wrap}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>Game Labs</p>
          <h1>Kleine Spiele.<br /><span>Große Pause.</span></h1>
          <p className={styles.lead}>Wörter finden, Bits sortieren, Wissen aufdecken.<br />Such dir deine nächste Denkpause aus.</p>
        </section>

        <section className={styles.games} aria-labelledby="games-title">
          <div className={styles.sectionHead}><h2 id="games-title">Was spielen wir heute?</h2><span>Drei Spiele. Dein Tempo.</span></div>
          <div className={styles.grid}>
            {games.map(game => <article className={`${styles.game} ${game.status === 'alpha' ? styles.experiment : ''}`} key={game.id}>
              <div className={styles.preview} aria-hidden="true"><GamePreview game={game} /></div>
              <div className={styles.gameBody}>
                <div className={styles.gameTop}><h3>{game.title}</h3><span className={`${styles.status} ${game.status === 'live' ? styles.live : styles.alpha}`}>{game.status === 'live' ? 'Live' : 'Alpha'}</span></div>
                <p>{game.description}</p>
                {game.status === 'alpha' && <small className={styles.alphaNote}>Im Aufbau · Rückmeldungen willkommen</small>}
                <Link className={styles.playLink} href={game.href}>{game.status === 'live' ? 'Jetzt spielen' : 'Experiment öffnen'}<ArrowUpRight size={17} aria-hidden="true" /></Link>
              </div>
            </article>)}
          </div>
          <details className={styles.credit}><summary>Bildnachweis</summary><p>Wikipedia-Logo: Wikimedia / Nohat, Konzept Paullusmagnus. <a href="https://commons.wikimedia.org/wiki/File:Wikipedia-logo-v2.svg" target="_blank" rel="noreferrer">Original und Mitwirkende</a> · <a href="https://creativecommons.org/licenses/by-sa/3.0/deed.de" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>. Unveränderte Grafik mit animiertem Lichtreflex. Die Spiele sind unabhängige Angebote von Paulik &amp; Reisch.</p></details>
        </section>
      </main>
      <Footer />
    </div>
  );
}

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import styles from './game-labs.module.css';
import '../../../tokens.css';

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

export default function GameLabsPage() {
  return (
    <div className={`pr-home ${styles.page}`}>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.wrap}>
            <p className={styles.eyebrow}>Paulik &amp; Reisch · Spielwiese</p>
            <h1>Kleine Spiele.<br /><em>Große Pause.</em></h1>
            <div className={styles.heroFoot}>
              <p>Worträtsel, Experimente und Ideen, die noch nicht stillsitzen können.</p>
              <span className={styles.heroMark} aria-hidden="true">P&amp;R<br />LAB</span>
            </div>
          </div>
        </section>

        <section className={styles.games} aria-labelledby="games-title">
          <div className={styles.wrap}>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.eyebrow}>Zum Ausprobieren</p>
                <h2 id="games-title">Was spielen wir heute?</h2>
              </div>
              <p className={styles.sectionNote}>Drei Versuche. Ein tägliches Ritual. Und ein paar Dinge, die noch wachsen.</p>
            </div>

            <div className={styles.grid}>
              {games.map((game, index) => (
                <article className={`${styles.game} ${index === 0 ? styles.featured : ''}`} key={game.id}>
                  <div className={styles.gameTop}>
                    <span className={styles.gameNumber}>0{index + 1} / {game.status === 'live' ? 'JETZT' : 'IM TEST'}</span>
                    <span className={`${styles.status} ${game.status === 'live' ? styles.live : styles.alpha}`}>
                      {game.status === 'live' ? 'Live' : 'Alpha'}
                    </span>
                  </div>
                  <div className={styles.gameMark} aria-hidden="true">{game.icon}</div>
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                  {game.status === 'alpha' && <small className={styles.alphaNote}>Im Aufbau · Rückmeldungen willkommen</small>}
                  <Link className={styles.playLink} href={game.href}>
                    {game.status === 'live' ? 'Jetzt spielen' : 'Experiment öffnen'}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>

            <p className={styles.note}>Game Labs ist unser Versuchslabor. Spielstände und Funktionen können sich ändern.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

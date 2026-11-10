import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { HomeMotion } from './home-motion';
import { homeBook, homeFaqs, homePeople } from '@/lib/home-content';
import styles from './home.module.css';
import '../../../tokens.css';

const arrow = <ArrowUpRight size={17} aria-hidden="true" />;

export function HomePage() {
  return (
    <div className={`pr-home ${styles.home}`}>
      <a className={styles.skip} href="#inhalt">Zum Inhalt springen</a>
      <Header />
      <main id="inhalt" tabIndex={-1}>
        <section className={styles.hero} aria-labelledby="home-title">
          <Image className={styles.heroImage} src="/hero-ab/hero-01-papier.jpg" alt="Hallo Welt Buchcover auf liniertem Papier - Satire über Schule und Bürokratie von Paulik & Reisch" fill priority sizes="100vw" data-home-parallax />
          <div className={styles.wrap}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Bücher, Satire &amp; ein bisschen Widerstand</p>
              <h1 id="home-title">Schule aus.<br /><span>Satire an.</span></h1>
              <p className={styles.intro}>Manches kann man nur mit Humor ertragen. Wir haben ein Buch daraus gemacht – und dann einfach weitergeschrieben.</p>
              <div className={styles.actions}>
                <Link href="/shop" className={styles.button}>„Hallo Welt“ entdecken {arrow}</Link>
                <a href="#entdecken" className={styles.textLink}>Weiterblättern <ArrowDown size={15} aria-hidden="true" /></a>
              </div>
              <p className={styles.caption}>Von Philipp Paulik &amp; Maximilian Reisch</p>
            </div>
          </div>
        </section>
        <section id="buch" aria-labelledby="book-title" className={`${styles.wrap} ${styles.section} ${styles.book}`}>
          <figure className={styles.bookVisual}>
            <Image src="/hero-ab/hero-03-tafel.jpg" alt="Hallo Welt Buch vor Kreidetafel - Satire über den Schulwahnsinn von Paulik & Reisch" fill sizes="(max-width: 639px) 90vw, 45vw" />
          </figure>
          <div className={styles.bookCopy}>
            <h2 id="book-title">Nicht für die Schule.<br />Fürs Überleben.</h2>
            <p className={styles.body}>Vertretungsstunden, marode Klassenzimmer und die hohe Kunst der Schulbürokratie. „Hallo Welt“ nimmt den ganz normalen Wahnsinn auseinander — böse, herzlich und erschreckend vertraut.</p>
            <p className={styles.body}>Eine satirische Abrechnung und Liebeserklärung an die Geschichten, die nach dem letzten Klingeln bleiben.</p>
            <dl className={styles.facts}>
              <div><dt>Umfang</dt><dd>{homeBook.pages} Seiten</dd></div>
              <div><dt>Lesestoff</dt><dd>{homeBook.chapters} Kapitel</dd></div>
              <div><dt>Haltung</dt><dd>Ungeschönt</dd></div>
            </dl>
            <div className={styles.actions}><Link className={styles.button} href="/shop">Zum Buch {arrow}</Link></div>
          </div>
        </section>
        <section className={styles.preview} aria-labelledby="preview-title">
          <div className={`${styles.wrap} ${styles.previewGrid}`}>
            <div className={styles.previewImage}>
              <Image src="/leseprobe/lesende-maus.jpg" alt="Eine lesende Maus mit Brille sitzt in einem Sessel und liest ein Buch" fill sizes="(max-width: 639px) 90vw, 40vw" />
            </div>
            <div className={styles.previewCopy}>
              <p className={styles.eyebrow}>Leseprobe</p>
              <h2 id="preview-title">Erst mal reinlesen?</h2>
              <p className={styles.body}>Lies ausgewählte Kapitel und wirf einen Blick auf den ganz normalen Schulwahnsinn, bevor du dich für das ganze Buch entscheidest.</p>
              <Link className={styles.button} href="/leseprobe">Seiten lesen {arrow}</Link>
            </div>
          </div>
        </section>
        <section id="entdecken" aria-labelledby="discover-title" className={`${styles.wrap} ${styles.section}`}>
          <div className={styles.sectionHead}>
            <div><p className={styles.eyebrow}>Zum Weiterlesen</p><h2 id="discover-title">Der Wahnsinn hat Methode.</h2></div>
          </div>
          <div className={styles.stories}>
            <article>
              <div className={styles.storyImage}><Image src="/hero-mobile/32-tafel-kreide.jpg" alt="Beschriebene Schultafel als Sinnbild für den Schulalltag" fill sizes="(max-width: 639px) 90vw, 50vw" /></div>
            </article>
            <div className={styles.storyList}>
              <article><p className={styles.eyebrow}>Sprache &amp; Bürokratie</p><h3 className={styles.storyTitle}><Link href="/ratgeber/beamtendeutsch">Das ist kein Satz. Das ist ein Verwaltungsakt.</Link></h3><p className={styles.body}>Beamtendeutsch verstehen — sofern die zuständige Stelle nichts dagegen hat.</p><Link className={styles.textLink} href="/ratgeber/beamtendeutsch">Weiterlesen {arrow}</Link></article>
              <article><p className={styles.eyebrow}>Schreiben &amp; Satire</p><h3 className={styles.storyTitle}><Link href="/ratgeber/satire-schreiben">Aus einer Beobachtung wird eine Pointe.</Link></h3><p className={styles.body}>Wie Übertreibung, Ironie und der richtige Blickwinkel zusammenfinden.</p><Link className={styles.textLink} href="/ratgeber/satire-schreiben">Zum Schreibratgeber {arrow}</Link></article>
            </div>
          </div>
        </section>
        <section id="worthaft" aria-labelledby="game-title" className={styles.game}>
          <div className={`${styles.wrap} ${styles.gameGrid}`}>
            <div><p className={styles.eyebrow}>Worthaft · Das tägliche Worträtsel</p><h2 id="game-title">Große Pause.<br />Fünf Buchstaben.</h2><p className={styles.body}>Sechs Versuche, ein Wort zu erraten.</p><Link href="/worthaft" className={styles.button}>Worthaft spielen <ArrowRight size={18} aria-hidden="true" /></Link><p className={styles.caption} style={{ color: 'inherit' }}>Kostenlos · auf Deutsch · Spielstand lokal im Browser</p></div>
            <div><div className={styles.tiles} aria-hidden="true">{'PAUSEHORDESAITE'.split('').map((letter, i) => <span className={styles.tile} key={i}>{letter}</span>)}</div></div>
          </div>
        </section>
        <section id="authors" aria-labelledby="people-title" className={`${styles.wrap} ${styles.section}`}>
          <div className={styles.sectionHead}><div><p className={styles.eyebrow}>Die Köpfe dahinter</p><h2 id="people-title">Nicht ganz unbeteiligt.</h2></div><Link className={styles.textLink} href="/ueber/autoren">Über uns {arrow}</Link></div>
          <div className={styles.people}>{homePeople.map(person => <article key={person.name}><Link className={styles.portrait} href={person.href} aria-label={`Mehr über ${person.name}`}><Image src={person.image} alt={`Porträt von ${person.name}`} fill sizes="(max-width: 639px) 90vw, 30vw" /></Link><p className={styles.eyebrow}>{person.role}</p><h3>{person.name}</h3><p className={styles.body}>{person.bio}</p><Link className={styles.textLink} href={person.href} aria-label={`Mehr über ${person.name}`}>Kennenlernen {arrow}</Link></article>)}</div>
        </section>
        <section aria-labelledby="faq-title" className={`${styles.wrap} ${styles.section} ${styles.faq}`}>
          <div><p className={styles.eyebrow}>Kurz erklärt</p><h2 id="faq-title">Noch eine<br />Wortmeldung?</h2><p className={styles.body}>Die häufigsten Fragen. Diesmal mit ernst gemeinten Antworten.</p></div>
          <div>{homeFaqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div>
        </section>
      </main>
      <Footer />
      <HomeMotion />
    </div>
  );
}

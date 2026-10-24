import { Footer } from './footer';
import { Header } from './header';
import styles from './legal-page.module.css';

type LegalPageProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function LegalPage({ title, description, children }: LegalPageProps) {
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#legal-content">Zum Inhalt springen</a>
      <Header />
      <main id="legal-content" className={styles.main}>
        <div className={styles.wrap}>
          <header className={styles.masthead}>
            <p className={styles.eyebrow}>Paulik &amp; Reisch <span aria-hidden="true">/</span> Rechtliches</p>
            <h1>{title}</h1>
            <p className={styles.description}>{description}</p>
          </header>
          <article className={styles.article}>{children}</article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
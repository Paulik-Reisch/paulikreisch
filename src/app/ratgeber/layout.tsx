import type { ReactNode } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import styles from '@/components/ratgeber/ratgeber.module.css';
import '../../../tokens.css';
export default function RatgeberLayout({children}:{children:ReactNode}) {
  return <div className={`pr-home ${styles.page}`}><a className={styles.skip} href="#ratgeber-inhalt">Zum Inhalt springen</a><Header/>{children}<Footer/></div>;
}

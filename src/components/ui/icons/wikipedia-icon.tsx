import Image from 'next/image';
import styles from './wikipedia-icon.module.css';

/** Decorative beside Wikiland's title; attribution is available in Quelle & Lizenz. */
export function WikipediaIcon({ className = '' }: { className?: string }) {
  return (
    <span className={`${styles.icon} ${className}`} aria-hidden="true">
      <Image src="/wikipedia-logo.png" alt="" width={64} height={58} sizes="64px" />
    </span>
  );
}

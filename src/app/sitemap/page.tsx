"use client";

import { useState } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { ChevronRight, FileText, ShoppingCart, Gamepad2, BookOpen, Users, Scale, Shield, Sparkles, ExternalLink, Search } from 'lucide-react';
import styles from '@/components/landing/utility-pages.module.css';

interface SitemapNode {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: SitemapNode[];
  description?: string;
  isExternal?: boolean;
}

const sitemapData: SitemapNode[] = [
  {
    label: 'Startseite',
    href: '/',
    icon: Sparkles,
    description: 'Bücher, Satire und Projekte von Paulik & Reisch',
  },
  {
    label: 'Autoren',
    href: '/ueber/autoren',
    icon: Users,
    description: 'Autoren-Porträts',
    children: [
      { label: 'Philipp Paulik', href: '/ueber/philipp-paulik' },
      { label: 'Maximilian Reisch', href: '/ueber/max-reisch' },
      { label: 'Luin Schiffbauer', href: '/ueber/luin-schiffbauer' },
    ],
  },
  {
    label: 'Shop & Bücher',
    href: '/shop',
    icon: ShoppingCart,
    description: 'Bücher und Leseproben',
    children: [
      { label: 'Leseprobe „Hallo Welt“', href: '/leseprobe', icon: BookOpen, description: 'Ausgewählte veröffentlichte Kapitel lesen' },
      { label: 'Buchhandlung', href: '/buchhandlung-paulik-reisch', icon: BookOpen, description: 'Unsere Bücher & Publikationen' },
    ],
  },
  {
    label: 'Ratgeber',
    href: '/ratgeber',
    icon: BookOpen,
    description: 'Satire, Schule, Sprache und Alltag',
    children: [
      { label: 'Satire schreiben', href: '/ratgeber/satire-schreiben', description: 'Merkmale, Stilmittel & Anleitung' },
      { label: 'Zeugnissprache', href: '/ratgeber/zeugnissprache', description: '40 Geheimcodes entziffert' },
      { label: 'Geschenk für Lehrer', href: '/ratgeber/geschenk-lehrer', description: '27 Ideen die ankommen' },
      { label: 'Abiturgeschenk', href: '/ratgeber/abiturgeschenk', description: '25 Ideen + Sprüche' },
      { label: 'Schulalltag', href: '/ratgeber/schulalltag', description: 'Guide: Lehrertypen & Co' },
      { label: 'Schulwitze', href: '/ratgeber/schulwitze', description: 'Die besten Witze über Schule' },
      { label: 'Beamtendeutsch', href: '/ratgeber/beamtendeutsch', description: 'Amtsdeutsch-Guide' },
      { label: 'Deutsche Sprache', href: '/ratgeber/deutsche-sprache', description: 'Warum sie so schwer ist' },
      { label: 'Typisch deutsch', href: '/ratgeber/typisch-deutsch', description: '12 Eigenheiten-Kapitel' },
      { label: 'Etikette', href: '/ratgeber/etikette', description: 'Benimm-Regeln die zählen' },
    ],
  },
  {
    label: 'Worthaft (Game)',
    href: '/worthaft',
    icon: Gamepad2,
    description: 'Das tägliche Worträtsel von Paulik & Reisch',
    children: [
      { label: 'Spielregeln & Über', href: '/worthaft/ueber', description: 'Wie Worthaft funktioniert' },
    ],
  },
  { label: 'Schreibstube', href: '/gpt', icon: FileText, description: 'Die experimentelle Schreib-KI' },
  {
    label: 'Game Labs (Alpha)',
    href: '/game-labs',
    icon: Gamepad2,
    description: 'Experimentelle Mini-Games',
    children: [
      { label: 'Bits', href: '/game-labs/bits' },
      { label: 'Wikiland', href: '/game-labs/wikiland' },
    ],
  },
  {
    label: 'Rechtliches & Info',
    href: '/impressum',
    icon: Scale,
    description: 'Gesetzlich vorgeschriebene Seiten',
    children: [
      { label: 'Impressum', href: '/impressum', icon: Scale },
      { label: 'Datenschutz', href: '/datenschutz', icon: Shield },
      { label: 'Cookie-Richtlinie', href: '/cookie-richtlinie', icon: Shield },
      { label: 'AGB', href: '/agb', icon: FileText },
      { label: 'Widerrufsbelehrung', href: '/widerruf', icon: FileText },
      { label: 'Urheberrecht', href: '/urheberrecht', icon: Scale },
      { label: 'Transparenz', href: '/transparenz', icon: Search },
      { label: 'Barrierefreiheit', href: '/barrierefreiheit', icon: Search },
    ],
  },
];

function SitemapNodeComponent({ node, depth = 0 }: { node: SitemapNode; depth?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = Boolean(node.children?.length);
  const Icon = node.icon || FileText;
  return (
    <li className={depth === 0 ? styles.node : styles.childNode}>
      <div className={styles.nodeRow}>
        <Icon className={styles.nodeIcon} aria-hidden="true" />
        <a href={node.href} className={depth === 0 ? styles.nodeLink : styles.childLink}>
          {node.label}
          {node.isExternal && <ExternalLink className="inline ml-2 h-3 w-3" aria-hidden="true" />}
        </a>
        {hasChildren && <button type="button" className={styles.expand} aria-expanded={isOpen} aria-label={`${node.label}: ${isOpen ? 'einklappen' : 'aufklappen'}`} onClick={() => setIsOpen(!isOpen)}><ChevronRight className={`h-4 w-4 ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" /></button>}
      </div>
      {node.description && depth === 0 && <p className={styles.nodeDescription}>{node.description}</p>}
      {isOpen && hasChildren && <ul className={styles.children}>{node.children!.map(child => <SitemapNodeComponent key={child.href} node={child} depth={depth + 1} />)}</ul>}
    </li>
  );
}

export default function SitemapPage() {
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.sitemapMain}>
        <header className={styles.masthead}>
          <h1>Sitemap</h1>
        </header>
        <ul className={styles.tree}>{sitemapData.map(node => <SitemapNodeComponent key={node.href} node={node} />)}</ul>
      </main>
      <Footer />
    </div>
  );
}

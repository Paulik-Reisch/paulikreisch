"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { ChevronRight, FileText, ShoppingCart, Gamepad2, BookOpen, Users, Scale, Shield, Sparkles, ExternalLink, Search, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    description: 'Landingpage — Paulik & Reisch Overview',
  },
  {
    label: 'Autoren',
    href: '/autoren',
    icon: Users,
    description: 'Autoren-Portraits',
  },
  {
    label: 'Shop & Bücher',
    href: '/shop',
    icon: ShoppingCart,
    description: 'Buch-Store & Merchandise',
    children: [
      { label: 'Leseprobe „Hallo Welt“', href: '/leseprobe', icon: BookOpen, description: 'Ausgewählte veröffentlichte Kapitel lesen' },
      { label: 'Buchhandlung', href: '/buchhandlung-paulik-reisch', icon: BookOpen, description: 'Unsere Bücher & Publikationen' },
    ],
  },
  {
    label: 'Ratgeber',
    href: '/ratgeber',
    icon: BookOpen,
    description: '10 Guides: Satire, Schule, Sprache & Alltag — SEO/AEO/GEO',
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
    description: 'Tägliches Worträtsel — Wordle-Klon',
    children: [
      { label: 'Spielregeln & Über', href: '/worthaft/ueber', description: 'Wie Worthaft funktioniert' },
    ],
  },
  {
    label: 'Game Labs (Alpha)',
    href: '/game-labs',
    icon: Gamepad2,
    description: 'Experimentelle Mini-Games',
    children: [
    ],
  },
  {
    label: 'Landingpages & Kampagnen',
    href: '/lp-palabrotas',
    icon: ExternalLink,
    description: 'Marketing-Landingpages',
    children: [
      { label: 'Palabrotas Haupt', href: '/lp-palabrotas', description: 'Kampagnen-Landingpage' },
      { label: 'Palabrotas Mehr Erfahren', href: '/lp-palabrotas/mehr-erfahren', description: 'Detail-Seite' },
      { label: 'Vibecoding Anleitung', href: '/vibecoding/anleitung', description: 'Developer-Guide' },
      { label: 'Los Chipirones', href: '/los-chipirones', description: 'Satire-Projekt' },
      { label: 'Pastel', href: '/pastel', description: 'Kreativ-Projekt' },
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

function SitemapNodeComponent({ node, depth = 0, index = 0 }: { node: SitemapNode; depth?: number; index?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon || FileText;

  const baseIndent = depth * 24;
  const isLast = index === (node.children?.length ?? 0) - 1;

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03, duration: 0.3 }}
        className={cn(
          'flex items-center gap-2 cursor-pointer group',
          depth > 0 && 'ml-4 border-l border-muted/30 pl-4',
          depth === 0 && 'mt-4'
        )}
        style={{ paddingLeft: baseIndent }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {/* Tree connector */}
        {depth > 0 && (
          <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-muted/30" />
        )}
        {depth > 0 && (
          <div className="absolute -left-4 top-1/2 w-3 h-0.5 bg-muted/30 transform -translate-y-1/2" />
        )}

        {/* Expand/Collapse */}
        {hasChildren && (
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            className="flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        )}

        {/* Icon */}
        <Icon className="h-5 w-5 text-primary/80 flex-shrink-0" />

        {/* Label & Link */}
        <a
          href={node.href}
          className={cn(
            'font-medium hover:text-primary transition-colors flex-1 truncate',
            depth === 0 && 'text-lg font-headline',
            depth > 0 && 'text-sm'
          )}
        >
          {node.label}
        </a>

        {/* External indicator */}
        {node.isExternal && (
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </motion.div>

      {/* Description */}
      {node.description && depth === 0 && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-xs text-muted-foreground ml-10 mt-1 mb-2 max-w-2xl"
        >
          {node.description}
        </motion.p>
      )}

      {/* Children */}
      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {node.children!.map((child, i) => (
              <SitemapNodeComponent key={child.href} node={child} depth={depth + 1} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="font-headline font-bold text-4xl md:text-5xl mb-4">
              Sitemap
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Visuelle Übersicht aller öffentlich zugänglichen Seiten.
              <br />
              <span className="text-sm">Admin-Bereiche &amp; interne Routen sind ausgeblendet.</span>
            </p>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-4 bg-muted/30 rounded-xl flex flex-wrap gap-4 justify-center text-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Kern-Seiten</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Inhalt/Artikel</span>
            </div>
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-primary" />
              <span>Spiele</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-primary" />
              <span>Rechtliches</span>
            </div>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              <span>Extern/Marketing</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span>Klick = Aufklappen</span>
            </div>
          </motion.div>

          {/* Sitemap Tree */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            {sitemapData.map((node, i) => (
              <SitemapNodeComponent key={node.href} node={node} index={i} />
            ))}
          </motion.div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-muted/30 rounded-xl text-center text-sm text-muted-foreground"
          >
            <p className="font-medium mb-1">Stand: {new Date().toLocaleDateString('de-DE')}</p>
            <p>Dynamische Inhalte (Artikel, Exzerpte) werden zur Build-Zeit in die XML-Sitemap aufgenommen.</p>
            <p className="mt-2">
              <a href="/sitemap.xml" className="text-primary hover:underline" target="_blank" rel="noopener">
                → XML-Sitemap für Suchmaschinen
              </a>
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/page-metadata';

export const metadata = pageMetadata({
  title: 'Sitemap',
  description: 'Die Seitenübersicht von Paulik & Reisch: Bücher, Autoren, Worthaft, Game Labs, Ratgeber und rechtliche Informationen.',
  path: '/sitemap',
});

export default function SitemapLayout({ children }: { children: ReactNode }) {
  return children;
}

import { getLegalPages } from '@/lib/firestore';
import { guidePaths } from '@/lib/ratgeber/registry';

export const dynamic = 'force-dynamic';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toW3C(date: Date): string | undefined {
  return Number.isFinite(date.getTime()) ? date.toISOString() : undefined;
}

export async function GET() {
  const baseUrl = 'https://paulikreisch.de';

  const legalPages = await getLegalPages().catch(() => []);

  const staticPages: Array<{ path: string; priority: number; changefreq: string; lastmod?: string }> = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/shop', priority: 0.9, changefreq: 'weekly' },
    { path: '/leseprobe', priority: 0.8, changefreq: 'monthly' },
    { path: '/ueber/autoren', priority: 0.7, changefreq: 'monthly' },
    { path: '/ueber/philipp-paulik', priority: 0.6, changefreq: 'monthly' },
    { path: '/ueber/max-reisch', priority: 0.6, changefreq: 'monthly' },
    { path: '/ueber/luin-schiffbauer', priority: 0.6, changefreq: 'monthly' },
    { path: '/worthaft', priority: 0.8, changefreq: 'weekly' },
    { path: '/worthaft/ueber', priority: 0.6, changefreq: 'monthly' },
    { path: '/ratgeber', priority: 0.85, changefreq: 'weekly' },
    { path: '/ratgeber/satire-schreiben', priority: 0.85, changefreq: 'monthly' },
    { path: '/ratgeber/zeugnissprache', priority: 0.85, changefreq: 'monthly' },
    { path: '/ratgeber/geschenk-lehrer', priority: 0.8, changefreq: 'monthly' },
    { path: '/ratgeber/abiturgeschenk', priority: 0.8, changefreq: 'monthly' },
    { path: '/ratgeber/schulalltag', priority: 0.85, changefreq: 'monthly' },
    { path: '/ratgeber/schulwitze', priority: 0.8, changefreq: 'monthly' },
    { path: '/ratgeber/beamtendeutsch', priority: 0.8, changefreq: 'monthly' },
    { path: '/ratgeber/deutsche-sprache', priority: 0.8, changefreq: 'monthly' },
    { path: '/ratgeber/typisch-deutsch', priority: 0.75, changefreq: 'monthly' },
    { path: '/ratgeber/etikette', priority: 0.75, changefreq: 'monthly' },
    { path: '/gpt', priority: 0.4, changefreq: 'monthly' },
    { path: '/buchhandlung-paulik-reisch', priority: 0.5, changefreq: 'monthly' },
    { path: '/sitemap', priority: 0.3, changefreq: 'monthly' },
    // legal pages (static fallback if Firestore empty)
    { path: '/impressum', priority: 0.3, changefreq: 'yearly' },
    { path: '/datenschutz', priority: 0.3, changefreq: 'yearly' },
    { path: '/cookie-richtlinie', priority: 0.3, changefreq: 'yearly' },
    { path: '/agb', priority: 0.3, changefreq: 'yearly' },
    { path: '/widerruf', priority: 0.3, changefreq: 'yearly' },
    { path: '/urheberrecht', priority: 0.3, changefreq: 'yearly' },
    { path: '/transparenz', priority: 0.3, changefreq: 'yearly' },
    { path: '/barrierefreiheit', priority: 0.3, changefreq: 'yearly' },
  ];


  const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: number }> = [];

  staticPages.push(...guidePaths().map(path => ({ path, priority: 0.7, changefreq: 'monthly' })));

  for (const p of staticPages) {
    urls.push({
      loc: `${baseUrl}${p.path}`,
      lastmod: p.lastmod,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }

  for (const page of legalPages as Array<{ id: string; lastUpdated: string | Date }>) {
    if (/^(index-old|admin|internal|login|autoren)(\/|$)/.test(page.id)) continue;
    urls.push({
      loc: `${baseUrl}/${escapeXml(page.id)}`,
      lastmod: toW3C(new Date(page.lastUpdated)),
      changefreq: 'monthly',
      priority: 0.5,
    });
  }

  // Deduplicate by loc (legalPages may overlap with staticPages)
  const seen = new Set<string>();
  const deduped = urls.filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${deduped
    .map(
      (u) => `  <url>\n    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

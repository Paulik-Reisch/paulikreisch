import { getLegalPages, getPublishedExcerpts, getArticles } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function toW3C(date: Date): string {
  return date.toISOString();
}

export async function GET() {
  const baseUrl = 'https://paulikreisch.de';

  const [legalPages, excerpts, articles] = await Promise.all([
    getLegalPages().catch(() => []),
    getPublishedExcerpts().catch(() => []),
    getArticles().catch(() => []),
  ]);

  const staticPages: Array<{ path: string; priority: number; changefreq: string; lastmod?: string }> = [
    { path: '/', priority: 1.0, changefreq: 'weekly' },
    { path: '/a', priority: 0.9, changefreq: 'weekly' },
    { path: '/shop', priority: 0.9, changefreq: 'weekly' },
    { path: '/exzerpte', priority: 0.7, changefreq: 'weekly' },
    { path: '/wiki/satire-landschaft', priority: 0.8, changefreq: 'weekly' },
    { path: '/worthaft', priority: 0.8, changefreq: 'weekly' },
    { path: '/worthaft/ueber', priority: 0.6, changefreq: 'monthly' },
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

  const now = toW3C(new Date());

  const urls: Array<{ loc: string; lastmod: string; changefreq: string; priority: number }> = [];

  for (const p of staticPages) {
    urls.push({
      loc: `${baseUrl}${p.path}`,
      lastmod: p.lastmod ?? now,
      changefreq: p.changefreq,
      priority: p.priority,
    });
  }

  for (const page of legalPages as Array<{ id: string; lastUpdated: string | Date }>) {
    urls.push({
      loc: `${baseUrl}/${escapeXml(page.id)}`,
      lastmod: toW3C(new Date(page.lastUpdated)),
      changefreq: 'monthly',
      priority: 0.5,
    });
  }

  for (const ex of excerpts as Array<{ slug: string; lastUpdated: string | Date }>) {
    urls.push({
      loc: `${baseUrl}/exzerpt/${escapeXml(ex.slug)}`,
      lastmod: toW3C(new Date(ex.lastUpdated)),
      changefreq: 'weekly',
      priority: 0.7,
    });
  }

  for (const art of articles as Array<{ slug: string; publishedDate: string | Date }>) {
    urls.push({
      loc: `${baseUrl}/a/${escapeXml(art.slug)}`,
      lastmod: toW3C(new Date(art.publishedDate)),
      changefreq: 'weekly',
      priority: 0.8,
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
      (u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
    )
    .join('\n')}\n</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

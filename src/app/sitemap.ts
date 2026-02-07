import { MetadataRoute } from 'next';
import { getLegalPages, getPublishedExcerpts } from '@/lib/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paulik-reisch.de';

  // 1. Get dynamic pages from Firestore
  const legalPages = await getLegalPages();
  const legalPageUrls = legalPages.map(page => ({
    url: `${baseUrl}/${page.id}`,
    lastModified: new Date(page.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const excerpts = await getPublishedExcerpts();
  const excerptUrls = excerpts.map(excerpt => ({
    url: `${baseUrl}/exzerpt/${excerpt.slug}`,
    lastModified: new Date(excerpt.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  
  // 2. Define static pages
  const staticPages = [
    '/',
    '/buchhandlung-paulik-reisch',
    '/lp2',
    '/lp3',
    '/lp-series',
    '/lp-pfeifer',
    '/lp-risitas',
    '/lp-risitas/biografie',
    '/lp-risitas/legales',
    '/lp-luin',
    '/los-chipirones',
    '/exzerpte',
    '/lp-schule-straflager',
    '/lp-lehrer-roboter',
    '/lp-mensa-todesfalle',
    '/lp-busfahren-mutprobe',
    '/lp-sport-ist-mord',
    '/lp-schulzeiten-genickbruch',
    '/lp-corona-satire',
    '/lp-buerokratie-simulator',
    '/lp-beamten-wartezeiten-simulator',
    '/lp-mietenwahnsinn',
    '/lp-palabrotas',
    '/lp-palabrotas/mehr-erfahren',
    '/vibecoding/anleitung',
    '/wiki/satire',
  ];

  const staticPageUrls = staticPages.map(path => {
    let priority = 0.8;
    if (path === '/') priority = 1.0;
    if (path === '/buchhandlung-paulik-reisch' || path === '/lp2') priority = 0.9;
    
    return {
      url: `${baseUrl}${path.startsWith('/') ? '' : '/'}${path.replace(/^\//, '')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: priority,
    };
  });


  // 3. Combine all URLs
  return [...staticPageUrls, ...legalPageUrls, ...excerptUrls];
}


import { MetadataRoute } from 'next';
import { getLegalPages, getPublishedExcerpts, getArticles } from '@/lib/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://paulikreisch.de';

  // 1. Get dynamic pages from Firestore
  const legalPagesPromise = getLegalPages();
  const excerptsPromise = getPublishedExcerpts();
  const articlesPromise = getArticles();

  const [legalPages, excerpts, articles] = await Promise.all([
    legalPagesPromise,
    excerptsPromise,
    articlesPromise,
  ]);
  
  const legalPageUrls = legalPages.map(page => ({
    url: `${baseUrl}/${page.id}`,
    lastModified: new Date(page.lastUpdated),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const excerptUrls = excerpts.map(excerpt => ({
    url: `${baseUrl}/exzerpt/${excerpt.slug}`,
    lastModified: new Date(excerpt.lastUpdated),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const articleUrls = articles.map(article => ({
    url: `${baseUrl}/a/${article.slug}`,
    lastModified: new Date(article.publishedDate),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    images: article.imageUrl ? [{ 
      loc: article.imageUrl,
      title: article.title,
      caption: article.teaser,
    }] : [],
  }));
  
  // 2. Define static pages
  const staticPages = [
    { path: '/', priority: 1.0, images: [{ loc: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/cover-mockup-1.png?alt=media&token=c82b73e5-76bd-490d-a65f-008a3bfac00b' }] },
    { path: '/a', priority: 0.9 },
    { path: '/shop', priority: 0.9, images: [
        { loc: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484' },
        { loc: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw2%2Fcover-hw2-900px.png?alt=media&token=9479f94f-e21d-4fe8-82d5-b668781bd724' }
    ] },
    { path: '/exzerpte', priority: 0.7 },
    { path: '/lp-palabrotas', priority: 0.7 },
    { path: '/lp-palabrotas/mehr-erfahren', priority: 0.5 },
    { path: '/vibecoding/anleitung', priority: 0.5 },
    { path: '/wiki/satire', priority: 0.6 },
    { path: '/wiki/satire-landschaft', priority: 0.8 },
    { path: '/worthaft', priority: 0.8 },
    { path: '/worthaft/ueber', priority: 0.6 },
  ];

  const staticPageUrls = staticPages.map(page => ({
    url: `${baseUrl}${page.path.startsWith('/') ? '' : '/'}${page.path.replace(/^\//, '')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page.priority,
    images: page.images,
  }));


  // 3. Combine all URLs
  return [...staticPageUrls, ...legalPageUrls, ...excerptUrls, ...articleUrls];
}

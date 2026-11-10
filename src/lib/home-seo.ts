import type { Metadata } from 'next';
import { getSeoMetadata } from './firestore';
import { homeBook, homeFaqs } from './home-content';

const site = 'https://paulikreisch.de';
const title = 'Paulik & Reisch — Hallo Welt, Schulsatire & Worthaft';
const description = 'Satire über Schule, Bürokratie und Alltag: Entdecke „Hallo Welt“ von Philipp Paulik und Maximilian Reisch sowie das tägliche Worträtsel Worthaft.';
const image = { url: `${site}/hero-ab/hero-01-papier.jpg`, width: 2100, height: 900, alt: 'Hallo Welt — das satirische Buch von Paulik & Reisch' };

/** Keep the editorial CMS usable, with a bounded fallback when Firestore is unavailable. */
export async function getHomeMetadata(): Promise<Metadata> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const seo = await Promise.race([
    getSeoMetadata('home').catch(() => null),
    new Promise<null>(resolve => { timeout = setTimeout(() => resolve(null), 1500); }),
  ]).finally(() => clearTimeout(timeout));
  const pageTitle = seo?.title || title;
  const pageDescription = seo?.metaDescription || description;
  return {
    title: { absolute: pageTitle }, description: pageDescription,
    alternates: { canonical: '/' },
    robots: { index: true, follow: true, 'max-image-preview': 'large' },
    openGraph: { type: 'website', locale: 'de_DE', url: site, siteName: 'Paulik & Reisch', title: seo?.ogTitle || pageTitle, description: seo?.ogDescription || pageDescription, images: seo?.ogImage ? [seo.ogImage] : [image] },
    twitter: { card: 'summary_large_image', title: seo?.twitterTitle || pageTitle, description: seo?.twitterDescription || pageDescription, images: seo?.twitterImage ? [seo.twitterImage] : [image.url] },
  };
}

export const homeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebPage', '@id': `${site}/#homepage`, url: `${site}/`, name: title, description, inLanguage: 'de-DE', isPartOf: { '@id': `${site}/#website` }, about: { '@id': `${site}/#organization` }, mainEntity: { '@id': `${site}/#hallo-welt` } },
    {
      '@type': 'Book',
      '@id': `${site}/#hallo-welt`,
      name: homeBook.title,
      alternateName: homeBook.subtitle,
      author: homeBook.authors.map(name => ({ '@type': 'Person', name })),
      illustrator: { '@type': 'Person', name: 'Luin Schiffbauer' },
      numberOfPages: homeBook.pages,
      inLanguage: 'de',
      genre: 'Satire',
      url: `${site}/shop`,
      isbn: '9798879791693',
      bookEdition: '1. Auflage',
      bookFormat: 'https://schema.org/Paperback',
      image: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/buecher-cover%2Fhw1%2Fcover-hw1_900px.png?alt=media&token=42ce90a3-ed34-49d2-8e09-5258d0dfc484',
      description: 'Zwischen Euphorie und Überforderung: Fragmente des Schülerdaseins. Eine Sammlung von Episoden, die das jugendliche Dasein beleuchten.',
      offers: {
        '@type': 'Offer',
        price: '10.99',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'Amazon' },
        url: 'https://amzn.eu/d/02nS59t2',
      },
    },
    { '@type': 'FAQPage', '@id': `${site}/#fragen`, isPartOf: { '@id': `${site}/#homepage` }, mainEntity: homeFaqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
  ],
};

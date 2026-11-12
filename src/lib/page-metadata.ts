import type { Metadata } from 'next';

const SITE_URL = 'https://paulikreisch.de';
export const SITE_NAME = 'Paulik & Reisch';

/** Standard social image, same asset the root layout uses. */
export const SOCIAL_IMAGE = {
  url: 'https://firebasestorage.googleapis.com/v0/b/hallo-welt-paulik-reisch.firebasestorage.app/o/Frame-social.png?alt=media&token=0bd72452-4230-4a07-8bec-0f557f2aa3c7',
  width: 1200,
  height: 630,
  alt: 'Paulik & Reisch — Satire, Buch Hallo Welt, Worthaft',
};

type PageMetadataInput = {
  /** Page title without site suffix; the root layout appends "| Paulik & Reisch". */
  title: string;
  description: string;
  /** Canonical path of the page, e.g. '/datenschutz'. */
  path: string;
  openGraph?: {
    /** Defaults to "<title> | Paulik & Reisch". */
    title?: string;
    /** Defaults to the page description. */
    description?: string;
  };
};

/**
 * Central metadata for standard pages: title/description, canonical and
 * Open Graph/Twitter tags from one place. A page-level openGraph object
 * replaces the root layout's, so this helper repeats the shared defaults
 * (image, siteName, locale, twitter creator) instead of dropping them.
 * Pages with special requirements (shop, worthaft, game-labs, noindex
 * areas, the Firestore-driven home) keep their own metadata blocks.
 */
export function pageMetadata({ title, description, path, openGraph }: PageMetadataInput): Metadata {
  const ogTitle = openGraph?.title ?? `${title} | ${SITE_NAME}`;
  const ogDescription = openGraph?.description ?? description;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title: ogTitle,
      description: ogDescription,
      images: [SOCIAL_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      creator: '@paulikreisch',
      images: [SOCIAL_IMAGE.url],
    },
  };
}

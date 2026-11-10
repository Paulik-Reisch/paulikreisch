import 'server-only';

import { unstable_cache } from 'next/cache';
import { fetchLegalPagesStrict, getLegalFallback, getLegalPage, type LegalPage } from './firestore';
import { pickLegalPage } from './legal-page-lookup';

/** Cache tag of the legal pages list. The admin action refreshes it after an edit. */
export const LEGAL_PAGES_CACHE_TAG = 'legal-pages';

const LEGAL_PAGES_REVALIDATE_SECONDS = 60 * 60;

const getCachedLegalPages = unstable_cache(fetchLegalPagesStrict, ['legal-pages-v1'], {
  revalidate: LEGAL_PAGES_REVALIDATE_SECONDS,
  tags: [LEGAL_PAGES_CACHE_TAG],
});

/**
 * Public legal page lookup. The whole `legal` collection is read once per
 * revalidation period instead of one document per request, and a slug that does
 * not exist (for example a scanner request) costs no read. A failed read is
 * not cached: the request falls back to the per-document read.
 */
export async function getLegalPageCached(slug: string): Promise<LegalPage | null> {
  let pages: LegalPage[];
  try {
    pages = await getCachedLegalPages();
  } catch (error) {
    console.error('Failed to load the cached legal pages; reading the single page.', error);
    return getLegalPage(slug);
  }
  return pickLegalPage(pages, slug, getLegalFallback);
}

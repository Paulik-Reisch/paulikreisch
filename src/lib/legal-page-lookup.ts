import type { LegalPage } from './firestore';

/**
 * Picks a legal page from an already loaded list. A slug that is not in the
 * list resolves to the local fallback text, or to null for an unknown slug,
 * without any database read.
 */
export function pickLegalPage(
  pages: readonly LegalPage[],
  slug: string,
  fallback: (slug: string) => LegalPage | null,
): LegalPage | null {
  return pages.find(page => page.id === slug) ?? fallback(slug);
}

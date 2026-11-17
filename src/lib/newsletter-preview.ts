import 'server-only';
import { getAdminDb } from './firebase-admin';
import { publishedNewsletterHtml } from './newsletter-visibility';

/** Legacy public link: never return drafts or the private newsletter record. */
export async function getPublishedNewsletterHtml(id: string): Promise<string | null> {
  if (!id || id.length > 1500 || id.includes('/')) return null;
  const snapshot = await getAdminDb().collection('newsletters').doc(id).get();
  if (!snapshot.exists) return null;
  return publishedNewsletterHtml(snapshot.data());
}

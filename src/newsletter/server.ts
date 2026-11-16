import 'server-only';
import { getAdminDb } from '@/lib/firebase-admin';
// @ts-ignore plain ESM modules without type declarations
import { NewsletterSubscribers } from './subscribers.mjs';
// @ts-ignore
import { FirestoreSubscriberStore } from './firestore-store.mjs';

/** Server secret for opaque tokens. Set as an App Hosting secret; never in the repo. */
export function newsletterSecret(): string {
  const s = process.env.NEWSLETTER_TOKEN_SECRET || '';
  if (s.length < 32) throw new Error('NEWSLETTER_TOKEN_SECRET missing');
  return s;
}

/** Fail closed: the recipient collection must be private first. The live Firestore
 * rules currently allow public reads on every collection, so nothing here may
 * read or write until the rules exclude `newsletter_recipients` and this flag is
 * set to "1" in the App Hosting environment. */
export function newsletterStoreEnabled(): boolean {
  return process.env.NEWSLETTER_STORE_ENABLED === '1';
}

export function getNewsletterSubscribers() {
  if (!newsletterStoreEnabled()) throw new Error('newsletter store disabled');
  const idKey = process.env.NEWSLETTER_ID_KEY || '';
  if (idKey.length < 32) throw new Error('NEWSLETTER_ID_KEY missing');
  const previousSecrets = (process.env.NEWSLETTER_TOKEN_SECRET_PREVIOUS || '').split(',').map((x) => x.trim()).filter((x) => x.length >= 32);
  return new NewsletterSubscribers(new FirestoreSubscriberStore(getAdminDb()), { secret: newsletterSecret(), previousSecrets, idKey });
}

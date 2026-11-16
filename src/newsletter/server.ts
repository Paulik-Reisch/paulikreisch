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

export function getNewsletterSubscribers() {
  return new NewsletterSubscribers(new FirestoreSubscriberStore(getAdminDb()), { secret: newsletterSecret() });
}

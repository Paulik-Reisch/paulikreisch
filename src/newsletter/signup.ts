import 'server-only';
import { getNewsletterSubscribers } from './server';
// @ts-ignore plain ESM modules without type declarations
import { requestSubscription } from './doi.mjs';
// @ts-ignore
import { createResend } from './resend.mjs';

/** Shared by the signup server action and the JSON route. Throws when not configured. */
export async function subscribeWithDoubleOptIn({ email, source, hp }: { email: string; source: string; hp?: string }): Promise<{ ok: boolean }> {
  const apiKey = process.env.RESEND_API_KEY || '';
  const from = process.env.NEWSLETTER_FROM || '';
  if (!apiKey || !from) throw new Error('not configured');
  return requestSubscription({
    subscribers: getNewsletterSubscribers(), resend: createResend({ apiKey }), from,
    replyTo: process.env.NEWSLETTER_REPLY_TO || undefined,
    baseUrl: process.env.NEWSLETTER_BASE_URL || 'https://paulikreisch.de',
    email, hp, source: source.slice(0, 80),
  });
}

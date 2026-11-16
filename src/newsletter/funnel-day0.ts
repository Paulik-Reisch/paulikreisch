import 'server-only';
import { funnelEmails } from '@/lib/funnel-emails';
// @ts-ignore plain ESM modules without type declarations
import { createResend } from './resend.mjs';
// @ts-ignore
import { unsubscribeUrl, oneClickUrl, listHeaders } from './campaign.mjs';

/** The lead-magnet mail (checklist) the funnel form promises. Sent once, right
 * after the person confirmed (double opt-in), with a real unsubscribe link and
 * RFC 8058 headers. The follow-up mails (day1, day3, day5, day7) are NOT sent
 * from here: their content needs a decision first. */
export async function sendFunnelDay0(
  { id, email, unsubscribeToken }: { id: string; email: string; unsubscribeToken: string },
) {
  const apiKey = process.env.RESEND_API_KEY || '';
  const from = process.env.NEWSLETTER_FROM || '';
  if (!apiKey || !from) throw new Error('not configured');
  const base = process.env.NEWSLETTER_BASE_URL || 'https://paulikreisch.de';
  const url = unsubscribeUrl(base, unsubscribeToken);
  const checklistUrl = 'https://paulikreisch.de/checkliste-lernvollzugsanstalt.pdf';
  const shopUrl = 'https://paulikreisch.de/shop';
  const { subject, html } = funnelEmails.day0;
  const body = html({ checklistUrl, shopUrl }) + `<p style="font-family:Inter,system-ui,sans-serif;font-size:12px;color:#6b7280;max-width:600px;margin:12px auto">Du willst keine Mails mehr? <a href="${url}">Hier abmelden</a>.</p>`;
  const text = `Danke für deine Anmeldung. Deine Checkliste: ${checklistUrl}\nZum Buch: ${shopUrl}\n\nAbmelden: ${url}\n`;
  return createResend({ apiKey }).send(
    { from, replyTo: process.env.NEWSLETTER_REPLY_TO || undefined, to: [email], subject, html: body, text, headers: listHeaders(oneClickUrl(base, unsubscribeToken)) },
    { idempotencyKey: `funnel-day0:${id}` },
  );
}

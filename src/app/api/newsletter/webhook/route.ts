import { NextResponse } from 'next/server';
import { getNewsletterFeedback } from '@/newsletter/server';
// @ts-ignore plain ESM module
import { verifyWebhook, suppressionsFor, WebhookRefused } from '@/newsletter/webhook.mjs';

export const dynamic = 'force-dynamic';

/** Resend (Svix) webhook: permanent bounces and spam complaints suppress the address.
 * The raw body is read as text before anything parses it, as the signature needs. */
export async function POST(req: Request) {
  const secret = process.env.NEWSLETTER_RESEND_WEBHOOK_SECRET || '';
  if (!secret || process.env.NEWSLETTER_FEEDBACK_ENABLED !== '1') return new NextResponse('not configured', { status: 503 });
  const rawBody = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
  };
  try {
    const event = verifyWebhook({ secret, rawBody, headers });
    // This provider account has other projects. Never apply their feedback here.
    if (!process.env.NEWSLETTER_FROM || event?.data?.from !== process.env.NEWSLETTER_FROM) return NextResponse.json({ ok: true, handled: 0 });
    const list = suppressionsFor(event);
    if (list.length) {
      const feedback = getNewsletterFeedback();
      for (const item of list) await feedback.suppress(item.email, item.reason);
    }
    return NextResponse.json({ ok: true, handled: list.length });
  } catch (e) {
    if (e instanceof WebhookRefused) return new NextResponse('invalid webhook', { status: 400 });
    console.error('newsletter webhook failed');
    return new NextResponse('error', { status: 500 });
  }
}

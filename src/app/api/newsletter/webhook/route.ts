import { NextResponse } from 'next/server';
import { getNewsletterSubscribers } from '@/newsletter/server';
// @ts-ignore plain ESM module
import { handleWebhook, WebhookRefused } from '@/newsletter/webhook.mjs';

export const dynamic = 'force-dynamic';

/** Resend (Svix) webhook: permanent bounces and spam complaints suppress the address.
 * The raw body is read as text before anything parses it, as the signature needs. */
export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET || '';
  if (!secret) return new NextResponse('not configured', { status: 503 });
  const rawBody = await req.text();
  const headers = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
  };
  try {
    const r = await handleWebhook({ subscribers: getNewsletterSubscribers(), secret, rawBody, headers });
    return NextResponse.json({ ok: true, handled: r.handled });
  } catch (e) {
    if (e instanceof WebhookRefused) return new NextResponse('invalid webhook', { status: 400 });
    console.error('newsletter webhook failed');
    return new NextResponse('error', { status: 500 });
  }
}

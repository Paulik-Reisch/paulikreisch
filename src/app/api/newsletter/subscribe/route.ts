import { NextResponse } from 'next/server';
import { getNewsletterSubscribers } from '@/newsletter/server';
// @ts-ignore plain ESM modules without type declarations
import { requestSubscription } from '@/newsletter/doi.mjs';
// @ts-ignore
import { createResend } from '@/newsletter/resend.mjs';

export const dynamic = 'force-dynamic';

/** Double opt-in start. Fails closed (503) until the recipient store is enabled
 * and the Firestore rules protect it. Answer is neutral for known/unknown addresses. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { email?: unknown; hp?: unknown } | null;
  try {
    const apiKey = process.env.NEWSLETTER_RESEND_API_KEY || '';
    const from = process.env.NEWSLETTER_FROM || '';
    if (!apiKey || !from) throw new Error('not configured');
    const r = await requestSubscription({
      subscribers: getNewsletterSubscribers(), resend: createResend({ apiKey }), from,
      replyTo: process.env.NEWSLETTER_REPLY_TO || undefined,
      baseUrl: process.env.NEWSLETTER_BASE_URL || 'https://paulikreisch.de',
      email: typeof body?.email === 'string' ? body.email : '', hp: body?.hp,
    });
    return NextResponse.json({ ok: !!r.ok }, { status: r.ok ? 200 : 400 });
  } catch {
    console.error('newsletter subscribe failed');
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

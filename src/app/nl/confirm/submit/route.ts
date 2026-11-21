import { NextResponse } from 'next/server';
import { getNewsletterSubscribers } from '@/newsletter/server';

export const dynamic = 'force-dynamic';

/** Called by the confirm page after the person pressed the button. A GET never confirms.
 * The retired checklist mail remains a no-op; confirmation and subscriber history are preserved. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { token?: unknown } | null;
  const token = typeof body?.token === 'string' ? body.token : '';
  try {
    const subscribers = getNewsletterSubscribers();
    const r = await subscribers.confirm(token) as { ok: boolean; expired?: boolean; id?: string; email?: string; source?: string | null };
    if (r.ok && r.id && r.email && r.source?.startsWith('funnel-')) {
      try {
        const { sendFunnelDay0 } = await import('@/newsletter/funnel-day0');
        await sendFunnelDay0({ id: r.id, email: r.email, unsubscribeToken: subscribers.unsubscribeToken({ id: r.id }) });
      } catch {
        console.error('newsletter funnel day0 failed');
      }
    }
    return NextResponse.json({ ok: !!r.ok, expired: !!r.expired }, { status: r.ok ? 200 : 400 });
  } catch {
    console.error('newsletter confirm failed');
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

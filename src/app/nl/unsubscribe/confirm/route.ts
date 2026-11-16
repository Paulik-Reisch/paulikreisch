import { NextResponse } from 'next/server';
import { getNewsletterSubscribers } from '@/newsletter/server';

export const dynamic = 'force-dynamic';

/** Called by the unsubscribe page after the person confirmed. A GET never unsubscribes. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { token?: unknown } | null;
  const token = typeof body?.token === 'string' ? body.token : '';
  try {
    const r = await getNewsletterSubscribers().unsubscribe(token);
    return NextResponse.json({ ok: !!r.ok }, { status: r.ok ? 200 : 400 });
  } catch (e) {
    console.error('newsletter unsubscribe failed');
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

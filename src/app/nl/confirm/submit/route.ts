import { NextResponse } from 'next/server';
import { getNewsletterSubscribers } from '@/newsletter/server';

export const dynamic = 'force-dynamic';

/** Called by the confirm page after the person pressed the button. A GET never confirms. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { token?: unknown } | null;
  const token = typeof body?.token === 'string' ? body.token : '';
  try {
    const r = await getNewsletterSubscribers().confirm(token);
    return NextResponse.json({ ok: !!r.ok, expired: !!(r as { expired?: boolean }).expired }, { status: r.ok ? 200 : 400 });
  } catch {
    console.error('newsletter confirm failed');
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

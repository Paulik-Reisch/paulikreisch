import { NextResponse } from 'next/server';
import { getNewsletterUnsubscriber } from '@/newsletter/server';

export const dynamic = 'force-dynamic';

/** RFC 8058 one-click: mail clients POST `List-Unsubscribe=One-Click` to the header URL. */
export async function POST(req: Request) {
  const token = new URL(req.url).searchParams.get('t') || '';
  const body = await req.text().catch(() => '');
  if (!/(^|&)List-Unsubscribe=One-Click(&|$)/.test(body)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    const r = await getNewsletterUnsubscriber().unsubscribe(token);
    return NextResponse.json({ ok: !!r.ok }, { status: r.ok ? 200 : 400 });
  } catch (e) {
    console.error('newsletter one-click unsubscribe failed');
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}

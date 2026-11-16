import { getAdminStorage } from '@/lib/firebase-admin';
// @ts-ignore plain ESM modules without type declarations
import { MarketingService } from '@/marketing/service.mjs';
// @ts-ignore
import { PrivateBucketStorage } from '@/marketing/private-bucket.mjs';
// @ts-ignore
import { renderNewsletterWeb, NEWSLETTER_WEB_HEADERS } from '@/marketing/render.mjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public browser view of a newsletter that was explicitly published in the studio.
 * Serves the immutable published snapshot only, never a draft. Same release gate as
 * the studio itself; without it the path does not exist. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const secret = process.env.SESSION_SECRET;
  if (process.env.MARKETING_STUDIO_RELEASE !== 'structured-v1-accepted' || !secret || secret.length < 32) return new Response('Not found', { status: 404 });
  const { slug } = await params;
  if (!/^[a-z0-9][a-z0-9-]{0,80}$/.test(slug)) return new Response('Not found', { status: 404 });
  try {
    const bucket = getAdminStorage().bucket('hallo-welt-paulik-reisch.firebasestorage.app');
    const doc = await new MarketingService(new PrivateBucketStorage(bucket, secret)).public(slug, 'newsletter');
    return new Response(renderNewsletterWeb(doc), { headers: NEWSLETTER_WEB_HEADERS });
  } catch {
    return new Response('Not found', { status: 404 });
  }
}

import { headers } from 'next/headers';
import { requestHost } from '@/lib/admin-host-policy';
import { getAdminAuth, getAdminStorage } from '@/lib/firebase-admin';
import { isAdminEmail } from '@/lib/admin-allowlist';
import { createFirebaseMarketing } from '@/marketing/firebase-binding.mjs';
import { createStudioTransportTest } from '@/newsletter/transport-binding';
import { createStudioNewsletter } from '@/newsletter/studio-binding';
import { createStudioFiles, createStudioLinks } from '@/lib/studio-integrations';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
let handler: ((request: Request) => Promise<Response>) | undefined;
const hosts = new Set(['m.paulikreisch.de', 'lp.paulikreisch.de', 'ads.paulikreisch.de']);
async function route(request: Request, context: { params: Promise<{ path?: string[] }> }) {
  // This gate is set only after this feature's hosting/build cost and privacy
  // acceptance, DNS/TLS, Auth key restrictions and storage checks are settled.
  if (process.env.MARKETING_STUDIO_RELEASE !== 'structured-v1-accepted') return new Response('Not found', { status: 404 });
  const host = requestHost(await headers());
  if (!host || !hosts.has(host)) return new Response('Not found', { status: 404 });
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return new Response('Not ready', { status: 503 });
  const apiKey = process.env.MARKETING_FIREBASE_API_KEY;
  if (!apiKey) return new Response('Not ready', { status: 503 });
  const bucket = getAdminStorage().bucket('hallo-welt-paulik-reisch.firebasestorage.app');
  handler ??= createFirebaseMarketing({
    bucket,
    firebaseAuth: getAdminAuth(), apiKey, secret, allowedEmail: isAdminEmail,
    // Reuse the accepted private-asset and short-link releases on their shared
    // private bucket prefix. Without those gates the studio sections stay 404.
    files: process.env.PRIVATE_ASSET_RELEASE === 'private-prefix-v1-accepted' ? createStudioFiles(bucket) : undefined,
    newsletter: createStudioNewsletter(),
    transportTest: createStudioTransportTest(bucket),
    links: process.env.SHORT_LINK_RELEASE === 'private-prefix-v1-accepted' ? createStudioLinks(bucket) : undefined,
  });
  const { path = [] } = await context.params;
  const url = new URL(request.url);
  url.protocol = 'https:'; url.host = host; url.port = '';
  url.pathname = '/' + path.map(encodeURIComponent).join('/');
  const init: RequestInit & { duplex?: 'half' } = { method: request.method, headers: request.headers };
  if (request.body) { init.body = request.body; init.duplex = 'half'; }
  return handler(new Request(url, init));
}
export { route as GET, route as HEAD, route as POST, route as PUT, route as DELETE, route as PATCH, route as OPTIONS };

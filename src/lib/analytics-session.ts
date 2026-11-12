import 'server-only';
import { cookies, headers } from 'next/headers';
import { requestHost, isSameOrigin } from './admin-host-policy';
import { ANALYTICS_HOST } from './management-hosts';
import { isAdminEmail } from './admin-allowlist';
import { decodeAnalyticsSession } from './analytics-session-token';
export const ANALYTICS_COOKIE = '__Host-analytics-session';
export function analyticsSessionKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('Sitzungskonfiguration fehlt.');
  return new TextEncoder().encode(secret);
}
export async function assertAnalyticsOrigin(): Promise<void> {
  const values = await headers();
  const host = requestHost(values);
  if (host !== ANALYTICS_HOST || !isSameOrigin(values.get('origin'), host, true)) throw new Error('Nur auf der Analytics-Adresse erlaubt.');
}
export async function getAnalyticsSession(): Promise<{ email: string } | null> {
  if (requestHost(await headers()) !== ANALYTICS_HOST) return null;
  const value = (await cookies()).get(ANALYTICS_COOKIE)?.value;
  if (!value) return null;
  const session = await decodeAnalyticsSession(value, analyticsSessionKey());
  return session && isAdminEmail(session.email) ? session : null;
}

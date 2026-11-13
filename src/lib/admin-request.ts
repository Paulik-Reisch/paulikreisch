import 'server-only';
import { headers } from 'next/headers';
import { ADMIN_HOST, isLocalHost, isSameOrigin, requestHost } from './admin-host-policy';

/** Login/logout are callable Server Actions, not just buttons on a protected page. */
export async function assertAdminMutationOrigin(): Promise<void> {
  const requestHeaders = await headers();
  const host = requestHost(requestHeaders);
  const local = process.env.NODE_ENV !== 'production' && isLocalHost(host);
  if ((!local && host !== ADMIN_HOST) || !host || !isSameOrigin(requestHeaders.get('origin'), host, !local)) {
    throw new Error('Admin-Aktion nur auf der Verwaltungsadresse erlaubt.');
  }
}

/** Only login/logout and file actions opt into the static host. General admin mutations stay admin-only. */
export async function assertFileMutationOrigin(): Promise<void> {
  const h = await headers(); const host = requestHost(h);
  if (host === 'static.paulikreisch.de' && isSameOrigin(h.get('origin'), host, true)) return;
  return assertAdminMutationOrigin();
}

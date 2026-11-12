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

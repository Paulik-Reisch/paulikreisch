export const PUBLIC_HOST = 'paulikreisch.de';
export const ADMIN_HOST = 'admin.paulikreisch.de';
export const PUBLIC_ORIGIN = `https://${PUBLIC_HOST}`;
export const ADMIN_ORIGIN = `https://${ADMIN_HOST}`;

export interface RequestHeaders { get(name: string): string | null }

/** Reject lists, ports and malformed authorities rather than guessing a host. */
export function normalizeHost(value: string | null): string | null {
  if (!value || value !== value.trim() || !/^[a-z0-9.-]+(?::[0-9]+)?$/i.test(value)) return null;
  const host = value.toLowerCase();
  if (/^(localhost|127\.0\.0\.1):[0-9]+$/.test(host)) return host;
  return host.includes(':') ? null : host;
}

export function isLocalHost(host: string | null): boolean {
  return host === 'localhost' || host === '127.0.0.1' || /^(localhost|127\.0\.0\.1):[0-9]+$/.test(host ?? '');
}

export function isSiteHost(host: string | null): boolean {
  return !!host && (host === PUBLIC_HOST || host.endsWith(`.${PUBLIC_HOST}`)
    || host === 'paulik-reisch.de' || host.endsWith('.paulik-reisch.de'));
}

/** Firebase supplies the external authority in X-Forwarded-Host.
 * A recognized direct authority wins only when the two agree; mismatches fail closed.
 * Unknown forwarded authorities never become redirect destinations.
 */
export function requestHost(headers: RequestHeaders): string | null {
  const raw = normalizeHost(headers.get('host'));
  const forwardedValue = headers.get('x-forwarded-host');
  if (forwardedValue === null) return raw;
  const forwarded = normalizeHost(forwardedValue);
  if (!forwarded || !isSiteHost(forwarded)) return null;
  if (isSiteHost(raw) && raw !== forwarded) return null;
  return forwarded;
}

export function isAdminPath(path: string): boolean {
  return path === '/admin' || path.startsWith('/admin/');
}

export function isInternalPath(path: string): boolean {
  return path === '/internal' || path.startsWith('/internal/');
}

export function isPrivilegedPath(path: string): boolean {
  return isAdminPath(path) || isInternalPath(path) || isLoginPath(path);
}

export function isLoginPath(path: string): boolean {
  return path === '/login' || path === '/login/';
}

export function isSafeMethod(method: string): boolean {
  return method === 'GET' || method === 'HEAD';
}

export function isSameOrigin(origin: string | null, host: string, production: boolean): boolean {
  return origin === `${production ? 'https' : 'http'}://${host}`;
}

import 'server-only';
import type { JWTPayload } from 'jose';
import { encodeAdminSession, decodeAdminSession } from './admin-session-token';
import { cookies, headers } from 'next/headers';
import { STATIC_HOST } from './management-hosts';
import { ADMIN_HOST, isLocalHost, requestHost } from './admin-host-policy';

export const ADMIN_SESSION_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-admin-session' : 'admin-session';

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET muss konfiguriert sein und mindestens 32 Zeichen enthalten.');
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: JWTPayload, audience: typeof ADMIN_HOST | typeof STATIC_HOST = ADMIN_HOST) {
  return encodeAdminSession(payload, sessionKey(), new Date(), audience);
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
  return decodeAdminSession(input, sessionKey());
}

export const STATIC_SESSION_COOKIE = process.env.NODE_ENV === 'production' ? '__Host-static-session' : 'static-session';

export async function getStaticSession() { return readSession(STATIC_HOST); }
export async function getSession() { return readSession(ADMIN_HOST); }

async function readSession(audience: typeof ADMIN_HOST | typeof STATIC_HOST) {
  const host = requestHost(await headers());
  if (host !== audience && !(process.env.NODE_ENV !== 'production' && isLocalHost(host))) return null;
  const sessionCookie = (await cookies()).get(audience === STATIC_HOST ? STATIC_SESSION_COOKIE : ADMIN_SESSION_COOKIE);
  if (!sessionCookie?.value) return null;
  const payload = await decodeAdminSession(sessionCookie.value, sessionKey(), new Date(), audience);
  if (!payload || typeof payload.expires !== 'string' || !payload.user || typeof payload.user !== 'object') return null;
  const user = payload.user as { id?: unknown };
  const expires = new Date(payload.expires).getTime();
  if (typeof user.id !== 'string' || !user.id || !Number.isFinite(expires) || expires <= Date.now()) return null;
  return { user: { id: user.id }, expires: payload.expires };
}

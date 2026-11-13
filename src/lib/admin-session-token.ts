import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { STATIC_HOST } from './management-hosts';
import { ADMIN_HOST } from './admin-host-policy';

/** The caller supplies the server-only key. No credential material lives here. */
export async function encodeAdminSession(payload: JWTPayload, key: Uint8Array, now = new Date(), audience: typeof ADMIN_HOST | typeof STATIC_HOST = ADMIN_HOST) {
  const issuedAt = Math.floor(now.getTime() / 1000);
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
    .setAudience(audience).setIssuedAt(issuedAt).setExpirationTime(issuedAt + 24 * 60 * 60).sign(key);
}

export async function decodeAdminSession(input: string, key: Uint8Array, now = new Date(), audience: typeof ADMIN_HOST | typeof STATIC_HOST = ADMIN_HOST): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'], audience, currentDate: now });
    return payload;
  } catch { return null; } // Malformed, foreign-audience or expired tokens mean unauthenticated.
}

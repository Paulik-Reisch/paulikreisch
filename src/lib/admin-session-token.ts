import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { ADMIN_HOST } from './admin-host-policy';

/** The caller supplies the server-only key. No credential material lives here. */
export async function encodeAdminSession(payload: JWTPayload, key: Uint8Array, now = new Date()) {
  const issuedAt = Math.floor(now.getTime() / 1000);
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
    .setAudience(ADMIN_HOST).setIssuedAt(issuedAt).setExpirationTime(issuedAt + 24 * 60 * 60).sign(key);
}

export async function decodeAdminSession(input: string, key: Uint8Array, now = new Date()): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, { algorithms: ['HS256'], audience: ADMIN_HOST, currentDate: now });
    return payload;
  } catch { return null; } // Malformed, foreign-audience or expired tokens mean unauthenticated.
}

import 'server-only';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

function sessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET muss konfiguriert sein und mindestens 32 Zeichen enthalten.');
  }
  return new TextEncoder().encode(secret);
}

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt().setExpirationTime('24h').sign(sessionKey());
}

export async function decrypt(input: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(input, sessionKey(), { algorithms: ['HS256'] });
    return payload;
  } catch { return null; }
}

export async function getSession() {
  const sessionCookie = (await cookies()).get('session');
  if (!sessionCookie?.value) return null;
  const payload = await decrypt(sessionCookie.value);
  if (!payload || typeof payload.expires !== 'string' || !payload.user || typeof payload.user !== 'object') return null;
  const user = payload.user as { id?: unknown };
  const expires = new Date(payload.expires).getTime();
  if (typeof user.id !== 'string' || !user.id || !Number.isFinite(expires) || expires <= Date.now()) return null;
  return { user: { id: user.id }, expires: payload.expires };
}
